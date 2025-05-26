import sql, { dbConfig1 } from "../../config/db.js";

// Utility to replace placeholders safely
const replacePlaceholders = (query, startTime, endTime) => {
  return query
    .replaceAll("{StartTime}", startTime)
    .replaceAll("{EndTime}", endTime);
};

// Final Line
export const getFinalHPFrz = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = `
    WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode 
    INNER JOIN Users u ON a.Operator = u.UserCode 
    WHERE a.StationCode = 1220010 
    AND u.UserRole = '224006' 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
  `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPChoc = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
    WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode 
    INNER JOIN Users u ON a.Operator = u.UserCode 
    WHERE a.StationCode = 1220010 
    AND u.UserRole = '224007' 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
`;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPSUS = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode  
    WHERE a.StationCode = 1230017 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
`;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPCAT = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
    SELECT MC.Name AS [Category], COUNT(*) AS [Count]
FROM MaterialBarcode AS MB
INNER JOIN Material AS M ON MB.Material = M.MatCode
INNER JOIN MaterialCategory AS MC ON M.Category = MC.CategoryCode
INNER JOIN ProcessActivity AS PA ON MB.DocNo = PA.PSNo
WHERE MB.Type IN (100, 400)
AND MB.Status <> 99
AND PA.StationCode IN (1220010, 1230017)
AND PA.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}'
AND PA.ActivityType = '5'
GROUP BY MC.Name;
  `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post Forming
export const getPostHPFrzA = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
  WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode  
    WHERE a.StationCode = 1220003 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
  `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPFrzB = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
  WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode  
    WHERE a.StationCode = 1220004 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
  `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPSUS = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
    WITH ProductionDetails AS (
    SELECT a.PSNo, c.Name, b.Material, a.StationCode, a.ProcessCode, a.ActivityOn, 
           DATEPART(HOUR, ActivityOn) AS TIMEHOUR, DATEPART(DAY, ActivityOn) AS TIMEDAY, 
           ActivityType, b.Type 
    FROM ProcessActivity a 
    INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo 
    INNER JOIN Material c ON b.Material = c.MatCode  
    WHERE a.StationCode = 1230012 
    AND a.ActivityType = 5 
    AND a.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
    AND b.Type NOT IN (0, 200)
), 
Summary AS (
    SELECT pd.TIMEDAY, pd.TIMEHOUR, COUNT(pd.PSNo) AS Loading_Count 
    FROM ProductionDetails pd 
    GROUP BY pd.TIMEHOUR, pd.TIMEDAY 
) 
SELECT CONCAT('H', ROW_NUMBER() OVER(ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
       su.TIMEHOUR, 
       su.Loading_Count AS COUNT 
FROM Summary su 
ORDER BY su.TIMEHOUR;
  `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPCAT = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
        SELECT MC.Name AS [Category], COUNT(*) AS [Count]
          FROM MaterialBarcode AS MB
            INNER JOIN Material AS M ON MB.Material = M.MatCode
            INNER JOIN MaterialCategory AS MC ON M.Category = MC.CategoryCode
            INNER JOIN ProcessActivity AS PA ON MB.DocNo = PA.PSNo
          WHERE MB.Type IN (100, 400)
            AND MB.Status <> 99
            AND PA.StationCode IN (1220003, 1220004, 1230012)
            AND PA.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}'
            AND PA.ActivityType = '5'
        GROUP BY MC.Name;
    `;
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forming
export const getFormingHpFomA = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = ``;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFormingHpFomB = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = ``;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFormingHpFomCat = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = ``;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
    await pool.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
