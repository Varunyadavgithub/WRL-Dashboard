import sql, { dbConfig2 } from "../../config/db.js";

export const getDispatchErrorLog = async (req, res) => {
  const { startDate, endDate } = req.query;
console.log(startDate,endDate)
  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

    -- Adjust to IST (UTC +5:30)
    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT 
    [Session_ID], 
    [FGSerialNo], 
    [AssetNo], 
    [ModelName], 
    [ModelCode],
    [ErrorMessage],
    b.ErrorName, 
    [ErrorOn]  
FROM 
    [DispatchErrorLog] a 
INNER JOIN 
    errormaster b 
ON 
    a.ErrorID = b.ErrorID 
WHERE 
    ErrorOn >= @AdjustedStartDate AND ErrorOn <= @AdjustedEndDate;
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
