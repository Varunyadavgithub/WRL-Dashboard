import sql, { dbConfig } from "../../config/db.js";

export const getBarcodeDetails = async (req, res) => {
  const { startDate, endDate, model } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Missing startDate or endDate.");
  }

  let query = `
    WITH Psno AS (
      SELECT 
        MB.DocNo, 
        MB.Material, 
        MB.Serial, 
        MB.VSerial,
        MB.Type,
        MB.Status
      FROM MaterialBarcode MB
      WHERE MB.PrintStatus = 1 
        AND MB.Status <> 99
    )
    SELECT 
      (SELECT Name FROM Material WHERE MatCode = Psno.Material) AS Model_Name,
      ISNULL(Psno.VSerial, '') AS [Asset_tag],
      CASE 
        WHEN SUBSTRING(Psno.Serial, 1, 1) IN ('S', 'F', 'L') THEN '' 
        ELSE Psno.Serial 
      END AS [FG_SR],
      MC.Name AS [Category]
    FROM 
      Psno
    JOIN 
      ProcessActivity PA ON PA.PSNo = Psno.DocNo
    JOIN 
      Material M ON Psno.Material = M.MatCode
    JOIN 
      MaterialCategory MC ON M.Category = MC.CategoryCode
    JOIN 
      WorkCenter WC ON PA.StationCode = WC.StationCode
    JOIN 
      Users US ON US.UserCode = PA.Operator
    WHERE 
      Psno.Type IN (100, 400)
      AND PA.ActivityType = 5
      AND PA.StationCode IN (1220010, 1230017)
      AND PA.ActivityOn BETWEEN @startDate AND @endDate
  `;

  if (model && model != 0) {
    query += ` AND Psno.Material = @model`;
  }

  query += ` ORDER BY Psno.Serial;`;

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    request.input("startDate", sql.DateTime, new Date(startDate));
    request.input("endDate", sql.DateTime, new Date(endDate));

    if (model && model != 0) {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching barcode details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
