import sql from "mssql";
import { dbConfig3 } from "../../config/db.js";
import multer from "multer";

// -------------------- Add New Equipment --------------------

const storage = multer.diskStorage({
  destination: "uploads/calibration/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage }).single("file");

export const addAsset = async (req, res) => {
  try {
    const d = req.body;
    const filePath = req.file
      ? "/uploads/calibration/" + req.file.filename
      : null;

    // Safe ID parsing
    const assetId =
      d.id !== undefined && d.id !== null && d.id !== ""
        ? parseInt(d.id, 10)
        : null;

    if (!d.lastDate || !d.frequency) {
      return res.status(400).send("Invalid Date / Frequency");
    }

    const nextDate = new Date(d.lastDate);
    nextDate.setMonth(nextDate.getMonth() + Number(d.frequency));

    const pool = await sql.connect(dbConfig3);

    /* ================= UPDATE ================= */
    if (assetId) {
      // 🔐 Fetch existing owner & department (CRITICAL)
      const existing = await pool
        .request()
        .input("ID", sql.Int, assetId)
        .query(`
          SELECT owner_employee_id, department_id
          FROM CalibrationAssets
          WHERE ID=@ID
        `);

      if (!existing.recordset.length) {
        return res.status(404).send("Asset not found");
      }

      const ownerEmployeeId =
        d.owner_employee_id ?? existing.recordset[0].owner_employee_id;

      const departmentId =
        d.department_id ?? existing.recordset[0].department_id;

      // 🔄 Update asset
      await pool
        .request()
        .input("ID", sql.Int, assetId)
        .input("EquipmentName", sql.VarChar, d.equipment)
        .input("IdentificationNo", sql.VarChar, d.identification)
        .input("LeastCount", sql.VarChar, d.leastCount)
        .input("RangeValue", sql.VarChar, d.range)
        .input("Location", sql.VarChar, d.location)
        .input("LastCalibrationDate", sql.Date, d.lastDate)
        .input("NextCalibrationDate", sql.Date, nextDate)
        .input("FrequencyMonths", sql.Int, Number(d.frequency))
        .input("OwnerEmployeeId", ownerEmployeeId)
        .input("DepartmentId", departmentId)
        .input("Remarks", sql.VarChar, d.remarks || null)
        .query(`
          UPDATE CalibrationAssets SET
            EquipmentName=@EquipmentName,
            IdentificationNo=@IdentificationNo,
            LeastCount=@LeastCount,
            RangeValue=@RangeValue,
            Location=@Location,
            LastCalibrationDate=@LastCalibrationDate,
            NextCalibrationDate=@NextCalibrationDate,
            FrequencyMonths=@FrequencyMonths,
            Remarks=@Remarks,
            owner_employee_id=@OwnerEmployeeId,
            department_id=@DepartmentId
          WHERE ID=@ID
        `);

      // 🧾 Log history if file uploaded
      if (filePath) {
        await pool
          .request()
          .input("AssetID", sql.Int, assetId)
          .input("CalibratedOn", d.lastDate)
          .input("ValidTill", nextDate)
          .input("PerformedBy", d.owner_employee_id || null)
          .input("CalibrationAgency", d.agency || null)
          .input("Result", "Pass")
          .input("FilePath", filePath)
          .input("EscalationLevel", "Updated")
          .query(`
            INSERT INTO CalibrationHistory
            (AssetID, CalibratedOn, ValidTill, PerformedBy,
             CalibrationAgency, Result, FilePath, EscalationLevel)
            VALUES
            (@AssetID,@CalibratedOn,@ValidTill,@PerformedBy,
             @CalibrationAgency,'Pass',@FilePath,@EscalationLevel)
          `);
      }

      return res.send({ message: "Equipment Updated Successfully" });
    }

    /* ================= INSERT ================= */
    const result = await pool
      .request()
      .input("EquipmentName", d.equipment)
      .input("IdentificationNo", d.identification)
      .input("LeastCount", d.leastCount)
      .input("RangeValue", d.range)
      .input("Location", d.location)
      .input("LastCalibrationDate", d.lastDate)
      .input("NextCalibrationDate", nextDate)
      .input("FrequencyMonths", Number(d.frequency))
      .input("OwnerEmployeeId", d.owner_employee_id)
      .input("DepartmentId", d.department_id)
      .input("Status", "Calibrated")
      .input("Remarks", d.remarks || null)
      .query(`
        INSERT INTO CalibrationAssets
        (
          EquipmentName,
          IdentificationNo,
          LeastCount,
          RangeValue,
          Location,
          LastCalibrationDate,
          NextCalibrationDate,
          FrequencyMonths,
          Status,
          Remarks,
          owner_employee_id,
          department_id
        )
        OUTPUT INSERTED.ID
        VALUES
        (
          @EquipmentName,
          @IdentificationNo,
          @LeastCount,
          @RangeValue,
          @Location,
          @LastCalibrationDate,
          @NextCalibrationDate,
          @FrequencyMonths,
          @Status,
          @Remarks,
          @OwnerEmployeeId,
          @DepartmentId
        )
      `);

    const newId = result.recordset[0].ID;

    // 🧾 Insert first history
    if (filePath) {
      await pool
        .request()
        .input("AssetID", sql.Int, newId)
        .input("CalibratedOn", d.lastDate)
        .input("ValidTill", nextDate)
        .input("PerformedBy", d.owner_employee_id || null)
        .input("CalibrationAgency", d.agency || null)
        .input("Result", "Pass")
        .input("FilePath", filePath)
        .input("EscalationLevel", "Calibrated")
        .query(`
          INSERT INTO CalibrationHistory
          (AssetID, CalibratedOn, ValidTill, PerformedBy,
           CalibrationAgency, Result, FilePath, EscalationLevel)
          VALUES
          (@AssetID,@CalibratedOn,@ValidTill,@PerformedBy,
           @CalibrationAgency,'Pass',@FilePath,@EscalationLevel)
        `);
    }

    res.send({ message: "Equipment Added Successfully" });
  } catch (err) {
    console.error("❌ ADD/UPDATE ERROR:", err);
    res.status(500).send("Failed");
  }
};

// controllers/compliance/calibration.js
export const uploadCalibrationReport = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id);
    const file = "/uploads/calibration/" + req.file.filename;
    const { performedByEmpId, agency, result } = req.body;

    if (!assetId || !file || !result) {
      return res.status(400).send("Invalid upload data");
    }

    const pool = await sql.connect(dbConfig3);

    /* ================= GET ASSET ================= */
    const assetRes = await pool
      .request()
      .input("ID", sql.Int, assetId)
      .query(`
        SELECT FrequencyMonths
        FROM CalibrationAssets
        WHERE ID = @ID
      `);

    if (!assetRes.recordset.length) {
      return res.status(404).send("Asset not found");
    }

    const freq = assetRes.recordset[0].FrequencyMonths;

    const calibratedOn = new Date(); // 🔑 NEW calibration date
    const nextDate = new Date(calibratedOn);
    nextDate.setMonth(nextDate.getMonth() + freq);

    /* ================= INSERT CALIBRATION HISTORY ================= */
    const historyInsert = await pool
      .request()
      .input("AssetID", sql.Int, assetId)
      .input("CalibratedOn", calibratedOn)
      .input("ValidTill", nextDate)
      .input("PerformedBy", performedByEmpId)
      .input("CalibrationAgency", agency)
      .input("Result", result)
      .input("FilePath", file)
      .input(
        "EscalationLevel",
        result === "Fail" ? "Critical" : "Calibrated"
      )
      .query(`
        INSERT INTO CalibrationHistory
        (AssetID, CalibratedOn, ValidTill, PerformedBy,
         CalibrationAgency, Result, FilePath, EscalationLevel)
        VALUES
        (@AssetID, @CalibratedOn, @ValidTill, @PerformedBy,
         @CalibrationAgency, @Result, @FilePath, @EscalationLevel)
      `);

    /* ================= UPDATE ASSET (RESET + NEW CYCLE) ================= */
    await pool
      .request()
      .input("ID", sql.Int, assetId)
      .input(
        "Status",
        result === "Fail" ? "Out of Calibration" : "Calibrated"
      )
      .input("LastCalibrationDate", calibratedOn)
      .input("NextCalibrationDate", nextDate)
      .query(`
        UPDATE CalibrationAssets
        SET
          Status = @Status,
          LastCalibrationDate = @LastCalibrationDate,
          NextCalibrationDate = @NextCalibrationDate,
          EscalationLevel = NULL,
          LastEscalationSentOn = NULL
        WHERE ID = @ID
      `);

    /* ================= CLOSE OLD ESCALATIONS ================= */
    await pool
      .request()
      .input("AssetID", sql.Int, assetId)
      .query(`
        UPDATE CalibrationEscalationLog
        SET Remarks = 'Resolved by new calibration',
            TriggeredBy = 'SYSTEM'
        WHERE AssetID = @AssetID
          AND Remarks IS NULL
      `);

    res.send("Calibration report uploaded & escalation reset ✅");
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).send("Upload failed");
  }
};

// -------------------- Load All --------------------
export const getAllAssets = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig3);
    const data = await pool.request().query(`
      SELECT
          A.*,
          H.EmployeeName,
          H.DepartmentName
      FROM CalibrationAssets A

      OUTER APPLY (
          SELECT TOP 1
              CH.AssetID,
              U.name AS EmployeeName,
              D.department_name AS DepartmentName
          FROM CalibrationHistory CH
          LEFT JOIN users U
              ON U.employee_id = CH.PerformedBy
          LEFT JOIN departments D
              ON D.DeptCode = u.department_id
          WHERE CH.AssetID = A.ID
          ORDER BY CH.CreatedAt DESC
      ) H

      ORDER BY A.NextCalibrationDate ASC;
        `);
    res.json(data.recordset);
  } catch {
    res.status(500).send("Load failed");
  }
};

// -------------------- Add calibration cycle history --------------------
export const addCalibrationRecord = async (req, res) => {
  const { assetId, calibratedOn, performedBy, agency, result, remarks, file } =
    req.body;
  try {
    const next = new Date(calibratedOn);
    next.setMonth(next.getMonth() + 12);

    const pool = await sql.connect(dbConfig3);
    await pool
      .request()
      .input("AssetID", assetId)
      .input("CalibratedOn", calibratedOn)
      .input("ValidTill", next.toISOString().slice(0, 10))
      .input("PerformedBy", performedBy)
      .input("CalibrationAgency", agency)
      .input("Result", result)
      .input("Remarks", remarks)
      .input("FilePath", file)
      .input("EscalationLevel", "Calibrated")
      .query(`INSERT INTO CalibrationHistory
    (AssetID,CalibratedOn,ValidTill,PerformedBy,CalibrationAgency,Result,
     FilePath,Remarks,EscalationLevel)
    VALUES(@AssetID,@CalibratedOn,@ValidTill,@PerformedBy,@CalibrationAgency,
           @Result,@FilePath,@Remarks,@EscalationLevel)`);

    await pool
      .request()
      .input("ID", assetId)
      .input("LastCalibrationDate", calibratedOn)
      .input("ValidTill", next.toISOString().slice(0, 10))
      .query(`UPDATE CalibrationAssets
          SET LastCalibrationDate=@LastCalibrationDate,ValidTill=@ValidTill,Status='Calibrated'
          WHERE ID=@ID`);

    res.send("Calibration Logged Successfully");
  } catch (err) {
    res.status(500).send("Failed");
  }
};

// -------------------- Get Certificates --------------------
export const getCertificates = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig3);

    const result = await pool
      .request()
      .input("AssetID", sql.Int, req.params.id)
      .query(`
        /* ================= CALIBRATION EVENTS ================= */
        SELECT
          CH.ID,
          CH.AssetID,
          CH.CreatedAt        AS EventTime,
          'CALIBRATION'       AS EventType,
          CH.Result,
          CH.FilePath,
          U.name              AS EmployeeName,
          D.department_name,
          NULL                AS EscalationLevel,
          NULL                AS MailTo,
          NULL                AS MailCC,
          CH.CalibrationAgency,
          CH.ValidTill
        FROM CalibrationHistory CH
        LEFT JOIN users U
          ON U.employee_id = CH.PerformedBy
        LEFT JOIN departments D
          ON D.DeptCode = U.department_id
        WHERE CH.AssetID = @AssetID

        UNION ALL

        /* ================= ESCALATION EVENTS ================= */
        SELECT
          EL.ID,
          EL.AssetID,
          EL.TriggeredOn      AS EventTime,
          'ESCALATION'        AS EventType,
          NULL                AS Result,
          NULL                AS FilePath,
          NULL                AS EmployeeName,
          NULL                AS department_name,
          CONCAT('L', EL.EscalationLevel) AS EscalationLevel,
          EL.MailTo,
          EL.MailCC,
          NULL                AS CalibrationAgency,
          NULL                AS ValidTill
        FROM CalibrationEscalationLog EL
        WHERE EL.AssetID = @AssetID

        ORDER BY EventTime DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ History load error:", err);
    res.status(500).send("Error loading history");
  }
};

// -------------------- Upload Certificate Only --------------------
export const uploadCertificate = async (req, res) => {
  try {
    const file = "/uploads/calibration/" + req.file.filename;
    const pool = await sql.connect(dbConfig3);
    await pool
      .request()
      .input("AssetID", req.params.id)
      .input("FilePath", file)
      .query(
        `UPDATE CalibrationAssets SET Remarks='Report Updated' WHERE ID=@AssetID`
      );
    res.send("Uploaded");
  } catch {
    res.status(500).send("Upload failed");
  }
};

// -------------------- Asset + history --------------------
export const getAssetWithHistory = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig3);
    const asset = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM CalibrationAssets WHERE ID=@id");
    const history = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM CalibrationHistory WHERE AssetID=@id");
    res.json({ asset: asset.recordset[0], history: history.recordset });
  } catch {
    res.status(500).send("Error");
  }
};
