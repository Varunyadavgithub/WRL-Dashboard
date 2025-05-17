import sql, { dbConfig1 } from "../../config/db.js";

export const getDispatchHoldDetails = async (req, res) => {
  const { startDate, endDate, status } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  let statusCondition = "";

  if (status) {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "hold") {
      statusCondition = " AND mb.Status = 11 AND dh.ReleasedDateTime IS NULL";
    } else if (lowerStatus === "release") {
      statusCondition =
        " AND mb.Status = 1 AND dh.ReleasedDateTime IS NOT NULL";
    }
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT
        m.Name AS ModelNo,
        dh.Serial AS FGSerialNo,
        dh.DefectCode AS HoldReason,
        dh.HoldDatetime AS HoldDate,
        u.UserName AS HoldBy,
        DATEDIFF(DAY, dh.HoldDateTime, dh.ReleasedDateTime) AS DaysOnHold,
        ISNULL(dh.Action, 'Not Released') AS CorrectiveAction,
        dh.ReleasedDateTime AS ReleasedOn,
        us.UserName AS ReleasedBy,
        CASE
            WHEN dh.ReleasedDateTime IS NULL THEN 'Hold'
            ELSE 'Release'
        END AS Status
    FROM
        DispatchHold AS dh
        INNER JOIN MaterialBarcode mb ON mb.Serial = dh.Serial
        INNER JOIN Material m ON m.MatCode = dh.Material
        LEFT JOIN Users u ON u.UserCode = dh.HoldUserCode
        LEFT JOIN Users us ON us.UserCode = dh.ReleasedUserCode
    WHERE
        dh.HoldDatetime >= @AdjustedStartDate
        AND dh.HoldDatetime <= @AdjustedEndDate
        ${statusCondition};
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("StartDate", sql.DateTime, new Date(startDate))
      .input("EndDate", sql.DateTime, new Date(endDate))
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
