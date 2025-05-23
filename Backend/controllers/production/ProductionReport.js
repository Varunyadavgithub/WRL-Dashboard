import sql, { dbConfig1 } from "../../config/db.js";

export const fetchFGData = async (req, res) => {
  const { startTime, endTime, model, stationCode } = req.query;

  if (!startTime || !endTime || !stationCode) {
    return res.status(400).json({
      success: false,
      message: "startTime, endTime, and stationCode are required",
    });
  }

  let query = `
DECLARE @AdjustedStartTime DATETIME, @AdjustedEndTime DATETIME;

-- Adjusting both times to IST (UTC +5:30)
SET @AdjustedStartTime = DATEADD(MINUTE, 330, @startTime);
SET @AdjustedEndTime = DATEADD(MINUTE, 330, @endTime);

WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Serial2, Alias 
    FROM MaterialBarcode 
    WHERE PrintStatus = 1 AND Status <> 99
),
FilteredData AS (
    SELECT 
        ps.Material,
        CASE WHEN ps.VSerial IS NULL THEN ps.Serial ELSE ps.Alias END AS Assembly_Sr_No
    FROM Psno ps
    JOIN ProcessActivity b ON b.PSNo = ps.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    WHERE b.ActivityType = 5
  AND b.ActivityOn >= @AdjustedStartTime
  AND b.ActivityOn <= @AdjustedEndTime
  AND c.StationCode = @stationCode
),
ModelStats AS (
    SELECT    
        MIN(f.Assembly_Sr_No) AS StartSerial,
        MAX(f.Assembly_Sr_No) AS EndSerial,
        COUNT(*) AS TotalCount,
        f.Material
    FROM FilteredData f
    GROUP BY f.Material
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY b.ActivityOn ASC) AS SrNo,
    (SELECT Name FROM Material WHERE MatCode = ps.Material) AS Model_Name,
    ps.Material AS ModelName,
    b.StationCode,
    c.Name AS Station_Name,
    CASE WHEN ps.VSerial IS NULL THEN ps.Serial ELSE ps.Alias END AS Assembly_Sr_No,
    ISNULL(ps.VSerial, '') AS Asset_tag,
    ISNULL(ps.Serial2, '') AS [Customer_QR],
    CASE WHEN SUBSTRING(ps.Serial, 1, 1) IN ('S', 'F', 'L') THEN '' ELSE ps.Serial END AS FG_SR,
    b.ActivityOn AS CreatedOn,
    us.UserName,
    ms.StartSerial,
    ms.EndSerial,
    ms.TotalCount
FROM Psno ps
JOIN ProcessActivity b ON b.PSNo = ps.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Users us ON us.UserCode = b.Operator
JOIN ModelStats ms ON ms.Material = ps.Material
WHERE b.ActivityType = 5
  AND b.ActivityOn >= @AdjustedStartTime
  AND b.ActivityOn <= @AdjustedEndTime
  AND c.StationCode = @stationCode

`;

  if (model && model != 0) {
    query += ` AND Psno.Material = @model`;
  }

  query += " ORDER BY SrNo;";

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const request = pool
      .request()
      .input("startTime", sql.DateTime, new Date(startTime))
      .input("endTime", sql.DateTime, new Date(endTime))
      .input("stationCode", sql.VarChar, stationCode);

    if (model && model != 0) {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
