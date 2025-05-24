import sql, { dbConfig1 } from "../../config/db.js";

export const getBarcodeDetails = async (req, res) => {
  const { startDate, endDate, model } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  let query = `
DECLARE @startTime DATETIME, @endTime DATETIME;
SET @startTime = @startDate;
SET @endTime = @endDate;

DECLARE @AdjustedStartTime DATETIME, @AdjustedEndTime DATETIME;

-- Adjusting both times to IST (UTC +5:30)
SET @AdjustedStartTime = DATEADD(MINUTE, 330, @startTime);
SET @AdjustedEndTime = DATEADD(MINUTE, 330, @endTime);

WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Serial2, Alias 
    FROM MaterialBarcode 
    WHERE PrintStatus = 1 AND Status <> 99
)
SELECT 
    (SELECT Name FROM Material WHERE MatCode = Psno.Material) AS Model_Name,
    ISNULL(Psno.VSerial, '') AS Asset_tag,
    CASE WHEN SUBSTRING(Psno.Serial, 1, 1) IN ('S', 'F', 'L') THEN '' ELSE Psno.Serial END AS FG_SR,
	  mc.Alias AS category
FROM Psno
JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Material m ON m.MatCode = PSNo.Material
JOIN MaterialCategory mc On mc.CategoryCode = m.Category
WHERE b.ActivityType = 5
  AND c.StationCode IN (1220010, 1230017)
  AND b.ActivityOn >= @AdjustedStartTime
  AND b.ActivityOn <= @AdjustedEndTime
`;

  // Optional filter for model
  if (model && model != 0) {
    query += ` AND Psno.Material = @model`;
  }

  query += ` ORDER BY Psno.Serial;`;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const request = pool.request();

    // Input parameters
    request.input("startDate", sql.DateTime, new Date(startDate));
    request.input("endDate", sql.DateTime, new Date(endDate));

    if (model && model != 0) {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    console.error("Error fetching barcode details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
