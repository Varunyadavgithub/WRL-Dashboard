import sql, { dbConfig1 } from "../../config/db.js";

// export const getDispatchHoldDetails = async (req, res) => {
//   const { startDate, endDate, status } = req.query;

//   if (!startDate || !endDate) {
//     return res.status(400).send("Missing startDate or endDate.");
//   }

//   const istStart = new Date(new Date(startDate).getTime() + 330 * 60000);
//   const istEnd = new Date(new Date(endDate).getTime() + 330 * 60000);

//   let statusCondition = "";
//   if (status) {
//     const lowerStatus = status.toLowerCase();
//     if (lowerStatus === "hold") {
//       statusCondition = " AND mb.Status = 11 AND dh.ReleasedDateTime IS NULL";
//     } else if (lowerStatus === "release") {
//       statusCondition =
//         " AND mb.Status = 1 AND dh.ReleasedDateTime IS NOT NULL";
//     }
//   }

//   const query = `
//     SELECT
//       m.Name AS ModelNo,
//       dh.Serial AS FGSerialNo,
//       dh.DefectCode AS HoldReason,
//       dh.HoldDatetime AS HoldDate,
//       u.UserName AS HoldBy,
//       DATEDIFF(DAY, dh.HoldDateTime, dh.ReleasedDateTime) AS DaysOnHold,
//       ISNULL(dh.Action, 'Not Released') AS CorrectiveAction,
//       dh.ReleasedDateTime AS ReleasedOn,
//       us.UserName AS ReleasedBy,
//       CASE
//         WHEN dh.ReleasedDateTime IS NULL THEN 'Hold'
//         ELSE 'Release'
//       END AS Status
//     FROM DispatchHold AS dh
//     INNER JOIN MaterialBarcode mb ON mb.Serial = dh.Serial
//     INNER JOIN Material m ON m.MatCode = dh.Material
//     LEFT JOIN Users u ON u.UserCode = dh.HoldUserCode
//     LEFT JOIN Users us ON us.UserCode = dh.ReleasedUserCode
//     WHERE dh.HoldDatetime BETWEEN @startDate AND @endDate
//     ${statusCondition};
//   `;

//   try {
//     const pool = await new sql.ConnectionPool(dbConfig1).connect();
//     const result = await pool
//       .request()
//       .input("startDate", sql.DateTime, istStart)
//       .input("endDate", sql.DateTime, istEnd)
//       .query(query);

//     res.json(result.recordset);
//     await pool.close();
//   } catch (err) {
//     console.error("SQL Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

export const getDispatchHoldDetails = async (req, res) => {
  const { startDate, endDate, status, page = 1, limit = 1000 } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const istStart = new Date(new Date(startDate).getTime() + 330 * 60000);
  const istEnd = new Date(new Date(endDate).getTime() + 330 * 60000);
  const offset = (parseInt(page) - 1) * parseInt(limit);

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
    WITH DispatchData AS (
      SELECT
        ROW_NUMBER() OVER (ORDER BY dh.HoldDatetime DESC) AS RowNum,
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
      FROM DispatchHold AS dh
      INNER JOIN MaterialBarcode mb ON mb.Serial = dh.Serial
      INNER JOIN Material m ON m.MatCode = dh.Material
      LEFT JOIN Users u ON u.UserCode = dh.HoldUserCode
      LEFT JOIN Users us ON us.UserCode = dh.ReleasedUserCode
      WHERE dh.HoldDatetime BETWEEN @startDate AND @endDate
      ${statusCondition}
    )
    SELECT 
      (SELECT COUNT(*) FROM DispatchData) AS totalCount,
      * 
    FROM DispatchData
    WHERE RowNum > @offset AND RowNum <= (@offset + @limit);
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("startDate", sql.DateTime, istStart)
      .input("endDate", sql.DateTime, istEnd)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, parseInt(limit))
      .query(query);

    res.status(200).json({
      success: true,
      data: result.recordset,
      totalCount:
        result.recordset.length > 0 ? result.recordset[0].totalCount : 0,
    });

    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
