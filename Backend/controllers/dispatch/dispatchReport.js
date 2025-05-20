import sql, { dbConfig2 } from "../../config/db.js";

export const getFgUnloading = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

    -- Adjust to IST (UTC +5:30)
    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT * 
    FROM DispatchUnloading
    WHERE DateTime >= @AdjustedStartDate AND DateTime <= @AdjustedEndDate;
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

export const getFgDispatch = async (req, res) => {
  const { startDate, endDate, status } = req.query;

  if (!startDate || !endDate || !status) {
    return res.status(400).send("Missing startDate, endDate, or status.");
  }

  const lowerStatus = status.toLowerCase();

  // Determine table and fields based on status
  let tableName, statusValue, additionalField;
  if (lowerStatus === "completed") {
    tableName = "DispatchMaster";
    statusValue = "Completed";
    additionalField = ", DM.Scan_ID";
  } else if (lowerStatus === "open") {
    tableName = "TempDispatch";
    statusValue = "Open";
    additionalField = ""; // Scan_ID not needed
  } else {
    return res.status(400).send("Invalid status. Use 'Completed' or 'Open'.");
  }

  const query = `
    DECLARE @AdjustedStartDate DATETIME, @AdjustedEndDate DATETIME;

    -- Adjust to IST (UTC +5:30)
    SET @AdjustedStartDate = DATEADD(MINUTE, 330, @StartDate);
    SET @AdjustedEndDate = DATEADD(MINUTE, 330, @EndDate);

    SELECT 
      DM.ModelName, 
      DM.FGSerialNo, 
      DM.AssetCode, 
      DM.Session_ID, 
      DM.AddedOn, 
      DM.AddedBy, 
      DM.Document_ID, 
      DM.ModelCode, 
      TD.DockNo, 
      TD.Vehicle_No, 
      TD.Generated_By
      ${additionalField}
    FROM ${tableName} DM
    INNER JOIN Tracking_Document TD ON DM.Document_ID = TD.Document_ID
    WHERE DM.AddedOn BETWEEN @AdjustedStartDate AND @AdjustedEndDate
      AND TD.LatestStatus = @StatusValue;
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig2).connect();
    const result = await pool
      .request()
      .input("StartDate", sql.DateTime, new Date(startDate))
      .input("EndDate", sql.DateTime, new Date(endDate))
      .input("StatusValue", sql.VarChar, statusValue)
      .query(query);

    res.json(result.recordset);
    await pool.close();
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
