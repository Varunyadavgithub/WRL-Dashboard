import sql, { dbConfig1 } from "../../config/db.js";

export const getFpaReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME, @AdjustedReportDate DATETIME;

    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT * FROM FPAReport WHERE Date BETWEEN @AdjustedStartDate AND @AdjustedEndDate
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

export const getFpaDailyReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME, @AdjustedReportDate DATETIME;

    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT
    CAST(Date AS DATE) AS Date,
    DATENAME(MONTH, Date) AS Month,
    SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) AS [NoOfCritical],
    SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) AS [NoOfMajor],
    SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) AS [NoOfMinor],
    COUNT(DISTINCT FGSRNo) AS [SampleInspected],
    ROUND(CAST(((SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) * 9)
        + (SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) * 6)
        + (SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) * 1)) AS FLOAT)
        / NULLIF(COUNT(DISTINCT FGSRNo), 0), 3) AS FPQI
FROM FPAReport
WHERE Date >= @AdjustedStartDate AND Date <= @AdjustedEndDate
GROUP BY CAST(Date AS DATE), DATENAME(MONTH, Date);
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

export const getFpaMonthlyReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME = DATEADD(MINUTE, 330, @StartDate);
    DECLARE @AdjustedEndDate DATETIME = DATEADD(MINUTE, 330, @EndDate);

    SELECT
      DATENAME(MONTH, CAST(Date AS DATE)) AS Month,
      YEAR(CAST(Date AS DATE)) AS Year,
      SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) AS [NoOfCritical],
      SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) AS [NoOfMajor],
      SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) AS [NoOfMinor],
      COUNT(DISTINCT FGSRNo) AS [SampleInspected],
      ROUND(
        CAST(
          ((SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) * 9) +
           (SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) * 6) +
           (SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) * 1)
          ) AS FLOAT
        ) / NULLIF(COUNT(DISTINCT FGSRNo), 0),
      3) AS FPQI
    FROM FPAReport
    WHERE CAST(Date AS DATE) BETWEEN @AdjustedStartDate AND @AdjustedEndDate
    GROUP BY 
      DATENAME(MONTH, CAST(Date AS DATE)), 
      YEAR(CAST(Date AS DATE));
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

export const getFpaYearlyReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME = DATEADD(MINUTE, 330, @StartDate);
    DECLARE @AdjustedEndDate DATETIME = DATEADD(MINUTE, 330, @EndDate);

    SELECT
      YEAR(CAST(Date AS DATE)) AS Year,
      SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) AS [NoOfCritical],
      SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) AS [NoOfMajor],
      SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) AS [NoOfMinor],
      COUNT(DISTINCT FGSRNo) AS [SampleInspected],
      ROUND(
        CAST(
          ((SUM(CASE WHEN Category = 'Critical' THEN 1 ELSE 0 END) * 9) +
           (SUM(CASE WHEN Category = 'Major' THEN 1 ELSE 0 END) * 6) +
           (SUM(CASE WHEN Category = 'Minor' THEN 1 ELSE 0 END) * 1)
          ) AS FLOAT
        ) / NULLIF(COUNT(DISTINCT FGSRNo), 0),
      3) AS FPQI
    FROM FPAReport
    WHERE CAST(Date AS DATE) BETWEEN @AdjustedStartDate AND @AdjustedEndDate
    GROUP BY YEAR(CAST(Date AS DATE));
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
