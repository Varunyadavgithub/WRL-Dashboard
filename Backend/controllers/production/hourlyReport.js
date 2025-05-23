import sql, { dbConfig1 } from "../../config/db.js";

export const getHourlySummary = async (req, res) => {
  const { stationCode, startDate, endDate } = req.query;

  if (!stationCode || !startDate || !endDate) {
    return res.status(400).send("Missing stationCode, startDate or endDate.");
  }

  const query = `
DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

-- Adjust both dates to IST (UTC +5:30)
SET @AdjustedStartDate = DATEADD(MINUTE, 330, @startDate);
SET @AdjustedEndDate = DATEADD(MINUTE, 330, @endDate);

WITH ProductionDetails AS (
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
  INNER JOIN Users u ON a.Operator = u.UserCode
  WHERE 
      a.StationCode = @stationCode
      AND a.ActivityType = 5
      AND a.ActivityOn BETWEEN @AdjustedStartDate AND @AdjustedEndDate
      AND b.Type NOT IN (0, 200)
),
Summary AS (
  SELECT 
      pd.TIMEDAY,
      pd.TIMEHOUR,
      COUNT(pd.PSNo) AS Loading_Count
  FROM ProductionDetails pd
  GROUP BY pd.TIMEHOUR, pd.TIMEDAY
)
SELECT 
  CONCAT('H', ROW_NUMBER() OVER (ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
  su.TIMEHOUR, 
  su.Loading_Count AS COUNT
FROM Summary su
ORDER BY su.TIMEHOUR;
`;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("stationCode", sql.Int, stationCode)
      .input("startDate", sql.DateTime, new Date(startDate))
      .input("endDate", sql.DateTime, new Date(endDate))
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getHourlyModelCount = async (req, res) => {
  const { stationCode, startDate, endDate, model } = req.query;

  if (!stationCode || !startDate || !endDate) {
    return res.status(400).send("Missing stationCode, startDate, or endDate.");
  }

  const query = `
DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

-- Adjust both dates to IST (UTC +5:30)
SET @AdjustedStartDate = DATEADD(MINUTE, 330, @startDate);
SET @AdjustedEndDate = DATEADD(MINUTE, 330, @endDate);

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
  INNER JOIN Users u ON a.Operator = u.UserCode
  WHERE
    a.StationCode = @stationCode AND
    a.ActivityType = 5 AND
    a.ActivityOn BETWEEN @AdjustedStartDate AND @AdjustedEndDate AND
    b.Type NOT IN (0, 200)
    ${model && model !== "0" ? "AND b.Material = @model" : ""}
)
SELECT 
  dd.TIMEHOUR,
  dd.Name,
  COUNT(dd.Name) AS ModelCount
FROM DUMDATA dd
GROUP BY dd.TIMEHOUR, dd.Name
ORDER BY dd.TIMEHOUR, ModelCount;
`;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const request = pool.request();

    request.input("stationCode", sql.Int, parseInt(stationCode));
    request.input("startDate", sql.DateTime, new Date(startDate));
    request.input("endDate", sql.DateTime, new Date(endDate));

    if (model && model !== "0") {
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