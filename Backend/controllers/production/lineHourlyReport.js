import sql, { dbConfig } from "../../config/db.js";

// Hourly Loading Controller
// export const getHourlyLoadingQuery = async (req, res) => {
//   const { stationCode, startDate, endDate, userRole } = req.query;

//   if (!stationCode || !startDate || !endDate) {
//     return res.status(400).send("Missing stationCode, startDate or endDate.");
//   }

//   const userRoleCondition = userRole
//     ? `AND u.UserRole = @userRole`
//     : `-- Optional UserRole filter skipped`;

//   const query = `
//     WITH ProductionDetails AS (
//         SELECT
//             a.PSNo,
//             c.Name,
//             b.Material,
//             a.StationCode,
//             a.ProcessCode,
//             a.ActivityOn,
//             DATEPART(HOUR, a.ActivityOn) AS TIMEHOUR,
//             DATEPART(DAY, a.ActivityOn) AS TIMEDAY,
//             a.ActivityType,
//             b.Type
//         FROM ProcessActivity a
//         INNER JOIN MaterialBarcode b ON a.PSNo = b.DocNo
//         INNER JOIN Material c ON b.Material = c.MatCode
//         LEFT JOIN Users u ON a.Operator = u.UserCode
//         WHERE a.StationCode = @stationCode
//           AND a.ActivityType = 5
//           AND a.ActivityOn BETWEEN @startDate AND @endDate
//           AND b.Type NOT IN (0, 200)
//           ${userRoleCondition}
//     ),
//     Summary AS (
//         SELECT
//             pd.TIMEDAY,
//             pd.TIMEHOUR,
//             COUNT(pd.PSNo) AS Loading_Count
//         FROM ProductionDetails pd
//         GROUP BY pd.TIMEHOUR, pd.TIMEDAY
//     )
//     SELECT
//         CONCAT('H', ROW_NUMBER() OVER (ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER,
//         su.TIMEHOUR,
//         su.Loading_Count AS COUNT
//     FROM Summary su
//     ORDER BY su.TIMEHOUR;
//   `;

//   try {
//     const pool = await sql.connect(dbConfig);
//     const request = pool
//       .request()
//       .input("stationCode", sql.Int, stationCode)
//       .input("startDate", sql.DateTime, startDate)
//       .input("endDate", sql.DateTime, endDate);

//     if (userRole) {
//       request.input("userRole", sql.VarChar, userRole);
//     }

//     const result = await request.query(query);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error("SQL Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// Category-wise Count Controller
// export const getCategoryWiseCount = async (req, res) => {
//   const { stationCodes, startDate, endDate } = req.query;

//   if (!stationCodes || !startDate || !endDate) {
//     return res.status(400).send("Missing stationCodes, startDate or endDate.");
//   }

//   // Ensure stationCodes is formatted properly for IN clause
//   const stationCodesArray = stationCodes
//     .split(",")
//     .map((code) => code.trim())
//     .filter(Boolean);
//   if (stationCodesArray.length === 0) {
//     return res.status(400).send("Invalid stationCodes provided.");
//   }

//   const placeholders = stationCodesArray
//     .map((_, i) => `@stationCode${i}`)
//     .join(",");

//   const query = `
//     SELECT
//         MC.Name AS [Category],
//         COUNT(*) AS [Count]
//     FROM MaterialBarcode AS MB
//     INNER JOIN Material AS M ON MB.Material = M.MatCode
//     INNER JOIN MaterialCategory AS MC ON M.Category = MC.CategoryCode
//     INNER JOIN ProcessActivity AS PA ON MB.DocNo = PA.PSNo
//     WHERE MB.Type IN (100, 400)
//       AND MB.Status <> 99
//       AND PA.StationCode IN (${placeholders})
//       AND PA.ActivityOn BETWEEN @startDate AND @endDate
//       AND PA.ActivityType = 5
//     GROUP BY MC.Name;
//   `;

//   try {
//     const pool = await sql.connect(dbConfig);
//     const request = pool.request();

//     stationCodesArray.forEach((code, i) => {
//       request.input(`stationCode${i}`, sql.Int, code);
//     });
//     request.input("startDate", sql.DateTime, startDate);
//     request.input("endDate", sql.DateTime, endDate);

//     const result = await request.query(query);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error("SQL Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// <--------------------------------------------------- Controller Methods --------------------------------------------------->
// Utility to replace placeholders safely
const replacePlaceholders = (query, startTime, endTime) => {
  return query
    .replaceAll("{StartTime}", startTime)
    .replaceAll("{EndTime}", endTime);
};

// Final Line
export const getFinalHPFrz = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPChoc = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  const query = `WITH ProductionDetails AS (
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPSUS = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinalHPCAT = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post Forming
export const getPostHPFrzA = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPFrzB = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPSUS = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostHPCAT = async (req, res) => {
  const { StartTime, EndTime } = req.query;
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
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forming
export const getFormingHpFomA = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  const query = ``;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFormingHpFomB = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  const query = ``;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFormingHpFomCat = async (req, res) => {
  const { StartTime, EndTime } = req.query;
  const query = ``;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query(replacePlaceholders(query, StartTime, EndTime));
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
