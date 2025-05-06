import sql, { dbConfig } from "../config/db.js";

export const getStageNames = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT Name, StationCode 
      FROM WorkCenter;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query error");
  }
};
