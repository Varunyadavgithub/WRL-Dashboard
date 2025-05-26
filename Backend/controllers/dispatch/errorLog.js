import sql, { dbConfig2 } from "../../config/db.js";

export const getDispatchErrorLog = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  try {
    const istStart = new Date(new Date(startDate).getTime() + 330 * 60000);
    const istEnd = new Date(new Date(endDate).getTime() + 330 * 60000);

    const query = `
      SELECT 
        [Session_ID], 
        [FGSerialNo], 
        [AssetNo], 
        [ModelName], 
        [ModelCode],
        [ErrorMessage],
        b.ErrorName, 
        [ErrorOn]  
      FROM [DispatchErrorLog] a 
      INNER JOIN errormaster b 
        ON a.ErrorID = b.ErrorID 
      WHERE ErrorOn BETWEEN @startDate AND @endDate;
    `;

    const pool = await new sql.ConnectionPool(dbConfig2).connect();
    const result = await pool
      .request()
      .input("startDate", sql.DateTime, istStart)
      .input("endDate", sql.DateTime, istEnd)
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
