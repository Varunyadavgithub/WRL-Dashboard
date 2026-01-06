import sql from "mssql";
import { dbConfig3 } from "../config/db.js";
import { sendCalibrationMail } from "./mailer.js";
import { ESCALATION_RECIPIENTS } from "../config/escalationConfig.js";

/**
 * Calibration Escalation Cron
 * ---------------------------
 * - Calculates escalation level based on DaysLeft
 * - Sends escalation mail only when level changes
 * - Throttles L3 (48 hours)
 * - Updates CalibrationAssets
 * - Logs escalation into CalibrationEscalationLog (AUDIT SAFE)
 */
export const runCalibrationEscalation = async () => {
  const pool = await sql.connect(dbConfig3);

  /* ================= LOAD ASSETS + LATEST CALIBRATION OWNER ================= */
  const result = await pool.request().query(`
    SELECT
      A.ID,
      A.EquipmentName,
      A.IdentificationNo,
      A.Location,
      A.NextCalibrationDate,
      A.EscalationLevel,
      A.LastEscalationSentOn,
      DATEDIFF(day, GETDATE(), A.NextCalibrationDate) AS DaysLeft,

      -- Latest calibration owner (important)
      U.employee_email,
      U.manager_email

    FROM CalibrationAssets A

    OUTER APPLY (
      SELECT TOP 1
        CH.PerformedBy
      FROM CalibrationHistory CH
      WHERE CH.AssetID = A.ID
      ORDER BY CH.CreatedAt DESC
    ) H

    LEFT JOIN users U
      ON U.employee_id = H.PerformedBy

    ORDER BY A.NextCalibrationDate ASC;
  `);

  /* ================= PROCESS EACH ASSET ================= */
  for (const a of result.recordset) {
    let level = null;

    /* ===== ESCALATION RULES ===== */
    if (a.DaysLeft <= -5) level = 3;
    else if (a.DaysLeft <= 5) level = 2;
    else if (a.DaysLeft <= 10) level = 1;
    else if (a.DaysLeft <= 15) level = 0;
    else continue; // No escalation zone

    const previousLevel =
      a.EscalationLevel !== null ? Number(a.EscalationLevel) : null;

    /* ===== SKIP IF SAME LEVEL ===== */
    if (previousLevel === level) {
      // L3 throttle: 48 hours
      if (
        level === 3 &&
        a.LastEscalationSentOn &&
        new Date() - new Date(a.LastEscalationSentOn) < 48 * 60 * 60 * 1000
      ) {
        continue;
      }

      // L0–L2: never repeat
      if (level !== 3) continue;
    }

    /* ===== RECIPIENT RESOLUTION ===== */
    const recipients = ESCALATION_RECIPIENTS(level, a);

    if (!recipients.to.length && !recipients.cc.length) {
      console.warn(`⚠️ No recipients found for AssetID=${a.ID}, skipping mail`);
      continue;
    }

    /* ===== SEND ESCALATION MAIL ===== */
    await sendCalibrationMail({
      level,
      asset: {
        EquipmentName: a.EquipmentName,
        IdentificationNo: a.IdentificationNo,
        Location: a.Location,
        NextCalibrationDate: a.NextCalibrationDate,
        DaysLeft: a.DaysLeft,
      },
      to: recipients.to,
      cc: recipients.cc,
    });

    /* ===== UPDATE ASSET STATE ===== */
    await pool
      .request()
      .input("ID", sql.Int, a.ID)
      .input("Level", sql.Int, level).query(`
        UPDATE CalibrationAssets
        SET EscalationLevel = @Level,
            LastEscalationSentOn = GETDATE()
        WHERE ID = @ID
      `);

    /* ===== INSERT ESCALATION LOG (AUDIT TABLE) ===== */

    const history = await pool.request().input("AssetID", sql.Int, a.ID).query(`
    SELECT TOP 1 ID
    FROM CalibrationHistory
    WHERE AssetID = @AssetID
    ORDER BY CreatedAt DESC
  `);

    const calibrationHistoryId = history.recordset.length
      ? history.recordset[0].ID
      : null;

    await pool
      .request()
      .input("AssetID", sql.Int, a.ID)
      .input("EscalationLevel", sql.Int, level)
      .input("DaysLeft", sql.Int, a.DaysLeft)
      .input("MailTo", sql.VarChar, recipients.to.join(","))
      .input("MailCC", sql.VarChar, recipients.cc.join(","))
      .input("CalibrationHistoryID", sql.Int, calibrationHistoryId)
      .input("TriggeredBy", sql.VarChar, "SYSTEM").query(`
        INSERT INTO CalibrationEscalationLog
        (
          AssetID,
          EscalationLevel,
          DaysLeft,
          MailTo,
          MailCC,
          CalibrationHistoryID,
          TriggeredBy
        )
        VALUES
        (
          @AssetID,
          @EscalationLevel,
          @DaysLeft,
          @MailTo,
          @MailCC,
          @CalibrationHistoryID,
          @TriggeredBy
        )
      `);
  }

  console.log("✅ Calibration escalation cron completed successfully");
};
