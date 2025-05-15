import sql, { dbConfig2 } from "../../config/db.js";

export const getDispatchUnloading = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    SELECT * FROM DispatchUnloading
    WHERE DateTime >= @StartDate AND DateTime <= @EndDate
    `;
  try {
    const pool = await new sql.ConnectionPool(dbConfig2).connect();
    const result = await pool
      .request()
      .input("StartDate", sql.DateTime, new Date(startDate))
      .input("EndDate", sql.DateTime, new Date(endDate))
      .query(query);

    res.json(result.recordset);
      await pool.close();
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
