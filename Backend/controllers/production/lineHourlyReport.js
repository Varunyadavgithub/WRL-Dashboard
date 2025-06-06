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
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    JOIN Users u ON b.Operator = u.UserCode
    WHERE
	 c.StationCode = 1220010 
    AND u.UserRole = '224006' 
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
)
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    JOIN Users u ON b.Operator = u.UserCode
    WHERE
	 c.StationCode = 1220010 
    AND u.UserRole = '224007' 
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
    const query = `  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1230017  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
)
SELECT 
    ISNULL(mc.Alias, 'N/A') AS category,
    COUNT(*) AS TotalCount
FROM Psno
JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Users us ON us.UserCode = b.Operator
JOIN Material m ON m.MatCode = Psno.Material
LEFT JOIN MaterialCategory mc ON mc.CategoryCode = m.Category
WHERE b.ActivityType = 5
  AND c.StationCode IN (1220010, 1230017)  
  AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}'
GROUP BY ISNULL(mc.Alias, 'N/A')
ORDER BY TotalCount DESC;
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

// Post Foaming
export const getPostHPFrzA = async (req, res) => {
  const { StartTime, EndTime } = req.query;

  try {
    const query = `
   WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1220003  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1220004  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1230012  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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
 WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
)
SELECT 
    ISNULL(mc.Alias, 'N/A') AS category,
    COUNT(*) AS TotalCount
FROM Psno
JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Users us ON us.UserCode = b.Operator
JOIN Material m ON m.MatCode = Psno.Material
LEFT JOIN MaterialCategory mc ON mc.CategoryCode = m.Category
WHERE b.ActivityType = 5
  AND c.StationCode IN (1220003, 1220004, 1230012)   
  AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}'
GROUP BY ISNULL(mc.Alias, 'N/A')
ORDER BY TotalCount DESC;
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

// Foaming
export const getFoamingHpFomA = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = `
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1220001  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY;
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

export const getFoamingHpFomB = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = `
  WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias, Type
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
),
HourlySummary AS (
    SELECT 
        DATEPART(DAY, b.ActivityOn) AS TIMEDAY,
        DATEPART(HOUR, b.ActivityOn) AS TIMEHOUR,
        COUNT(*) AS Loading_Count
    FROM Psno
    JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
    JOIN WorkCenter c ON b.StationCode = c.StationCode
    JOIN Material m ON Psno.Material = m.MatCode
    WHERE
	 c.StationCode = 1220002  
    AND b.ActivityType = 5 
    AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}' 
	GROUP BY DATEPART(DAY, b.ActivityOn), DATEPART(HOUR, b.ActivityOn)
) 
SELECT 
    CONCAT('H', ROW_NUMBER() OVER (ORDER BY TIMEHOUR, TIMEDAY)) AS HOUR_NUMBER,
    TIMEHOUR,
    Loading_Count AS COUNT
FROM HourlySummary
ORDER BY TIMEHOUR, TIMEDAY; 
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

export const getFoamingHpFomCat = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  try {
    const query = `
WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Alias
    FROM MaterialBarcode
    WHERE PrintStatus = 1 AND Status <> 99 AND Type NOT IN (200)
)
SELECT 
    ISNULL(mc.Alias, 'N/A') AS category,
    COUNT(*) AS TotalCount
FROM Psno
JOIN ProcessActivity b ON b.PSNo = Psno.DocNo
JOIN WorkCenter c ON b.StationCode = c.StationCode
JOIN Users us ON us.UserCode = b.Operator
JOIN Material m ON m.MatCode = Psno.Material
LEFT JOIN MaterialCategory mc ON mc.CategoryCode = m.Category
WHERE b.ActivityType = 5
  AND c.StationCode IN (1220001, 1220002)      
  AND b.ActivityOn BETWEEN '{StartTime}' AND '{EndTime}'
GROUP BY ISNULL(mc.Alias, 'N/A')
ORDER BY TotalCount DESC;
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
