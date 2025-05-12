import sql, { dbConfig } from "../../config/db.js";

export const getHourlySummary = async (req, res) => {
  const { stationCode, startDate, endDate } = req.query;

  if (!stationCode || !startDate || !endDate) {
    return res.status(400).send("Missing stationCode, startDate or endDate.");
  }

  const query = `WITH ProductionDetails AS (
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
      AND a.ActivityOn BETWEEN @startDate AND @endDate
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
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("stationCode", sql.Int, stationCode)
      .input("startDate", sql.DateTime, startDate)
      .input("endDate", sql.DateTime, endDate)
      .query(query);

    res.json(result.recordset);
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
        a.ActivityOn BETWEEN @startDate AND @endDate AND
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
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("stationCode", sql.Int, parseInt(stationCode));
    request.input("startDate", sql.DateTime, new Date(startDate));
    request.input("endDate", sql.DateTime, new Date(endDate));

    if (model && model !== "0") {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/performance-summary
// export const getPerformanceSummary = async (req, res) => {
//   const { stationCode, startDate, endDate } = req.query;

//   if (!stationCode || !startDate || !endDate) {
//     return res.status(400).send("Missing stationCode, startDate or endDate.");
//   }

//   const query = `
//     SELECT
//       b.Material,
//       c.Name,
//       COUNT(*) AS Count
//     FROM ProcessActivity a
//     JOIN MaterialBarcode b ON a.PSNo = b.DocNo
//     JOIN Material c ON b.Material = c.MatCode
//     WHERE
//       a.StationCode = @stationCode AND
//       a.ActivityType = 5 AND
//       a.ActivityOn BETWEEN @startDate AND @endDate AND
//       b.Type NOT IN (0, 200)
//     GROUP BY b.Material, c.Name
//     ORDER BY Count DESC;
//   `;

//   try {
//     const pool = await sql.connect(dbConfig);
//     const result = await pool
//       .request()
//       .input("stationCode", sql.Int, stationCode)
//       .input("startDate", sql.DateTime, startDate)
//       .input("endDate", sql.DateTime, endDate)
//       .query(query);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Database query error");
//   }
// };

// GET /api/stations
// export const getAllStations = async (req, res) => {
//   try {
//     const pool = await sql.connect(dbConfig);
//     const result = await pool
//       .request()
//       .query(`SELECT StationCode, StationName FROM Stations`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error fetching stations:", err);
//     res.status(500).send("Failed to fetch stations");
//   }
// };

// GET /api/station/:code
// export const getStationByCode = async (req, res) => {
//   const { code } = req.params;

//   try {
//     const pool = await sql.connect(dbConfig);
//     const result = await pool
//       .request()
//       .input("code", sql.Int, code)
//       .query(`SELECT * FROM Stations WHERE StationCode = @code`);

//     if (result.recordset.length === 0) {
//       return res.status(404).send("Station not found.");
//     }

//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error("Error fetching station:", err);
//     res.status(500).send("Failed to fetch station");
//   }
// };

// GET /api/materials
// export const getAllMaterials = async (req, res) => {
//   try {
//     const pool = await sql.connect(dbConfig);
//     const result = await pool
//       .request()
//       .query(`SELECT MatCode, Name FROM Material`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error fetching materials:", err);
//     res.status(500).send("Failed to fetch materials");
//   }
// };

// POST /api/activity/create
// export const createActivity = async (req, res) => {
//   const { PSNo, StationCode, ProcessCode, ActivityType, Operator, ActivityOn } =
//     req.body;

//   if (
//     !PSNo ||
//     !StationCode ||
//     !ProcessCode ||
//     !ActivityType ||
//     !Operator ||
//     !ActivityOn
//   ) {
//     return res.status(400).send("Missing required fields.");
//   }

//   try {
//     const pool = await sql.connect(dbConfig);
//     await pool
//       .request()
//       .input("PSNo", sql.VarChar, PSNo)
//       .input("StationCode", sql.Int, StationCode)
//       .input("ProcessCode", sql.Int, ProcessCode)
//       .input("ActivityType", sql.Int, ActivityType)
//       .input("Operator", sql.VarChar, Operator)
//       .input("ActivityOn", sql.DateTime, ActivityOn).query(`
//         INSERT INTO ProcessActivity (PSNo, StationCode, ProcessCode, ActivityType, Operator, ActivityOn)
//         VALUES (@PSNo, @StationCode, @ProcessCode, @ActivityType, @Operator, @ActivityOn)
//       `);

//     res.status(201).send("Activity created successfully.");
//   } catch (err) {
//     console.error("Error creating activity:", err);
//     res.status(500).send("Failed to create activity");
//   }
// };
