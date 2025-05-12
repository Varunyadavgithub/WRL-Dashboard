import sql, { dbConfig } from "../../config/db.js";

export const fetchFGData = async (req, res) => {
  const { startTime, endTime, model, stationCode } = req.query;

  // console.log(startTime, endTime, model, stationCode);

  if (!startTime || !endTime || !stationCode) {
    return res.status(400).json({
      success: false,
      message: "startTime, endTime, and stationCode are required",
    });
  }

  let query = `
WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Serial2, Alias 
    FROM MaterialBarcode 
    WHERE PrintStatus = 1 AND Status <> 99
),
FilteredData AS (
    SELECT 
        Psno.Material,
        CASE WHEN Psno.VSerial IS NULL THEN Psno.Serial ELSE Psno.Alias END AS Assembly_Sr_No
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    WHERE b.ActivityType = 5
      AND b.ActivityOn >= @startTime 
      AND b.ActivityOn <= @endTime
      AND c.StationCode = @stationCode
),
ModelStats AS (
    SELECT 
        f.Material,
        MIN(f.Assembly_Sr_No) AS StartSerial,
        MAX(f.Assembly_Sr_No) AS EndSerial,
        COUNT(*) AS TotalCount
    FROM FilteredData f
    GROUP BY f.Material
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY b.ActivityOn ASC) AS SrNo,
    (SELECT Name FROM Material WHERE MatCode = Psno.Material) AS Model_Name,
    Psno.Material AS ModelName,
    b.StationCode,
    c.Name AS Station_Name,
    CASE WHEN Psno.VSerial IS NULL THEN Psno.Serial ELSE Psno.Alias END AS Assembly_Sr_No,
    ISNULL(Psno.VSerial, '') AS Asset_tag,
    ISNULL(Psno.Serial2, '') AS [Customer_QR],
    CASE WHEN SUBSTRING(Psno.Serial, 1, 1) IN ('S', 'F', 'L') THEN '' ELSE Psno.Serial END AS FG_SR,
    b.ActivityOn AS CreatedOn,
    us.UserName,
    ms.StartSerial,
    ms.EndSerial,
    ms.TotalCount
FROM Psno
JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Users us ON us.UserCode = b.Operator
JOIN ModelStats ms ON ms.Material = Psno.Material
WHERE b.ActivityType = 5
  AND b.ActivityOn >= @startTime 
  AND b.ActivityOn <= @endTime
  AND c.StationCode = @stationCode

  `;

  // Only add model filter if model is not 0 or null
  if (model && model != 0) {
    query += ` AND Psno.Material = @model`;
  }

  query += " ORDER BY SrNo;";

  try {
    const pool = await sql.connect(dbConfig);
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
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
