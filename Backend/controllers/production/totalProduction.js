import sql, { dbConfig1 } from "../../config/db.js";

export const getBarcodeDetails = async (req, res) => {
  const { startDate, endDate, model } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
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
        Psno.Material,
        CASE WHEN Psno.VSerial IS NULL THEN Psno.Serial ELSE Psno.Alias END AS Assembly_Sr_No
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    WHERE b.ActivityType = 5
      AND b.ActivityOn >= @AdjustedStartTime
      AND b.ActivityOn <= @AdjustedEndTime
      AND c.StationCode IN (120010, 1230017)
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
    (SELECT Name FROM Material WHERE MatCode = Psno.Material) AS Model_Name,
    Psno.Material AS ModelName,
    ISNULL(Psno.VSerial, '') AS Asset_tag,
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
  AND c.StationCode IN (120010, 1230017)
  AND b.ActivityOn >= @AdjustedStartTime
  AND b.ActivityOn <= @AdjustedEndTime
`;

  if (model && model != 0) {
    query += ` AND Psno.Material = @model`;
  }

  query += ` ORDER BY Psno.Serial;`;

  try {
    const pool = await sql.connect(dbConfig1);
    const request = pool.request();

    request.input("startDate", sql.DateTime, new Date(startDate));
    request.input("endDate", sql.DateTime, new Date(endDate));

    if (model && model != 0) {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching barcode details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
