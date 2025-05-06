import sql, { dbConfig } from "../config/db.js";

export const getModelVariants = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT Name AS MaterialName, MatCode 
      FROM Material 
      WHERE Category <> 0 AND model <> 0 AND type = 100 AND Status = 1;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database query error");
  }
};
