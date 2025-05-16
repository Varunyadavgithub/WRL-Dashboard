import sql, { dbConfig1 } from "../../config/db.js";

export const getFpaCount = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  // Automatically use endDate as reportDate
  const reportDate = endDate;

  const query = `
DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME, @AdjustedReportDate DATETIME;

-- Adjust to IST (UTC +5:30)
SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);
SET @AdjustedReportDate = DATEADD(MINUTE, 330, @ReportDate);

WITH DUMDATA AS (
    SELECT 
        a.PSNo, 
        c.Name, 
        b.Material, 
        a.StationCode, 
        a.ProcessCode, 
        a.ActivityOn, 
        DATEPART(HOUR, a.ActivityOn) AS TIMEHOUR, 
        DATEPART(DAY, a.ActivityOn) AS TIMEDAY, 
        a.ActivityType, 
        b.Type
    FROM ProcessActivity a
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo
    INNER JOIN Material c ON b.Material = c.MatCode
    WHERE
        a.StationCode IN (1220010, 1230017)
        AND a.ActivityType = 5
        AND a.ActivityOn BETWEEN @AdjustedStartDate AND @AdjustedEndDate
        AND b.Type NOT IN (0, 200)
),
FPA_DATA AS (
    SELECT 
        dd.Name AS [ModelName],  
        COUNT(dd.Name) AS ModelCount,
        CASE 
            WHEN COUNT(dd.Name) < 10 THEN 0
            ELSE ((COUNT(dd.Name) - 1) / 100) + 1
        END AS FPA
    FROM DUMDATA dd
    GROUP BY dd.Name
),
FINAL_DATA AS (
    SELECT 
        fd.[ModelName], 
        fd.ModelCount, 
        fd.FPA,
        ISNULL(fp.[SampleInspected], 0) AS [SampleInspected]
    FROM FPA_DATA fd
    LEFT JOIN (
        SELECT 
            Model, 
            COUNT(DISTINCT(FGSRNo)) AS [SampleInspected]
        FROM FPAReport
        WHERE [Date] = @AdjustedReportDate
        GROUP BY Model
    ) fp ON fd.[ModelName] = fp.Model
)
SELECT 
    [ModelName], 
    ModelCount, 
    FPA, 
    [SampleInspected]
FROM FINAL_DATA
WHERE FPA > 0
ORDER BY ModelCount;
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("StartDate", sql.DateTime, new Date(startDate))
      .input("EndDate", sql.DateTime, new Date(endDate))
      .input("ReportDate", sql.DateTime, new Date(reportDate))
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
