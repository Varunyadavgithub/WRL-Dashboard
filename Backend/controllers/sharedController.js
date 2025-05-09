import sql from "mssql";
import dbConfig from "../config/db.js";

// Fetches a list of active model variants from the Material table.
export const getModelVariants = async (_, res) => {
  const query = `
    SELECT Name AS MaterialName, MatCode 
    FROM Material 
    WHERE Category <> 0 AND model <> 0 AND type = 100 AND Status = 1;
  `;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetches a list of all work stages from the WorkCenter table.
export const getStageNames = async (_, res) => {
  const query = `
    SELECT Name, StationCode 
    FROM WorkCenter;
  `;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
