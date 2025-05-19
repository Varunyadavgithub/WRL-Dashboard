import sql, { dbConfig1 } from "../../config/db.js";

export const getFpaCount = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  // Get current date in 'yyyy-MM-dd' to avoid SQL errors
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const reportDateStr = `${year}-${month}-${day}`;

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME, @AdjustedReportDate DATETIME;

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
            DATEPART(HOUR, ActivityOn) AS TIMEHOUR, 
            DATEPART(DAY, ActivityOn) AS TIMEDAY, 
            ActivityType, 
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
            WHERE CAST(Date AS DATE) = CAST(@ReportDate AS DATE)
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
      .input("ReportDate", sql.DateTime, new Date(reportDateStr))
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAssetDetails = async (req, res) => {
  const { AssemblySerial } = req.query;

  if (!AssemblySerial) {
    return res.status(400).send("Missing AssemblySerial.");
  }

  const query = `
    SELECT 
      mb.Serial + '~' + mb.VSerial + '~' + m.Alias AS combinedserial
    FROM 
      MaterialBarcode AS mb
    INNER JOIN 
      Material AS m ON m.MatCode = mb.Material
    WHERE 
      mb.Alias = @AssemblySerial;
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();

    const result = await pool
      .request()
      .input("AssemblySerial", sql.VarChar, AssemblySerial)
      .query(query);

    const combined = result.recordset[0]?.combinedserial;

    if (!combined) {
      return res.json({ FGNo: null, AssetNo: null, ModelName: null });
    }

    const [FGNo, AssetNo, ModelName] = combined.split("~");

    res.json({ FGNo, AssetNo, ModelName });
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ combinedserial: "~" + err.message });
  }
};
