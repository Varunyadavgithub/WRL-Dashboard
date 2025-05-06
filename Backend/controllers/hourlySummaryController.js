import sql, { dbConfig } from "../config/db.js";

export const getHourlySummary = async (req, res) => {
  const { stationCode, startDate, endDate } = req.query;

  if (!stationCode || !startDate || !endDate) {
    return res
      .status(400)
      .send("Please provide stationCode, startDate, and endDate.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("stationCode", sql.Int, stationCode)
      .input("startDate", sql.DateTime, startDate)
      .input("endDate", sql.DateTime, endDate).query(`
        WITH ProductionDetails AS (
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
          GROUP BY pd.TIMEDAY, pd.TIMEHOUR
        )
        SELECT 
          CONCAT('H', ROW_NUMBER() OVER (ORDER BY su.TIMEHOUR, su.TIMEDAY)) AS HOUR_NUMBER, 
          su.TIMEHOUR, 
          su.Loading_Count AS COUNT 
        FROM Summary su
        ORDER BY su.TIMEHOUR, su.TIMEDAY;
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query error");
  }
};
