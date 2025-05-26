import sql, { dbConfig1 } from "../../config/db.js";

export const generateReport = async (req, res) => {
  const { startTime, endTime, model } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "startTime and endTime are required",
    });
  }

  try {
    const istStart = new Date(new Date(startTime).getTime() + 330 * 60000);
    const istEnd = new Date(new Date(endTime).getTime() + 330 * 60000);

    let query = `
      WITH Bommaterials AS (
        SELECT DISTINCT * FROM (
          SELECT psno, BOMCode, RowID, Material, Qty, ConsumedQty FROM ProcessInputBOM
          UNION ALL
          SELECT psno, a.BOMCode, a.RowID, b.Material, Qty, ConsumedQty
          FROM ProcessInputBOM a
          INNER JOIN BOMInputAltMaterial b ON a.RowID = b.RowID AND a.BOMCode = b.BOMCode
        ) a
      )
      SELECT 
          '' AS SAP_PO,
          a.PSNo,
          MATBM.Name AS Model_Name,
          MATBM.Alias AS [Reference_Barcode],
          b.Serial AS [Component_Serial_Number],
          mat.Name AS [Component_Name],
          MatCat.Name AS [Component_Type],
          (SELECT Name FROM Ledger WHERE LedgerCode = mat.Ledger) AS Supplier_Name,
          b.ScannedOn,
          MATB.Serial AS [Fg_Sr_No],
          MATB.VSerial AS [Asset_tag],
          mat.AltName AS [SAP_Item_Code]
      FROM 
          ProcessOrder a
      INNER JOIN 
          ProcessInputBOMScan b ON a.PSNo = b.PSNo
      INNER JOIN 
          Bommaterials c ON c.PSNo = a.PSNo AND c.RowID = b.RowID AND c.Material = b.Material
      INNER JOIN 
          Material mat ON mat.MatCode = c.Material
      INNER JOIN 
          ProdHeader d ON a.PRODNo = d.PRODNo
      INNER JOIN 
          MaterialCategory MatCat ON MatCat.CategoryCode = mat.Category,
          MaterialBarcode MATB
      LEFT JOIN 
          Material MATBM ON MATBM.MatCode = MATB.Material
      WHERE 
          MATB.DocNo = a.PSNo
          AND b.ScannedOn BETWEEN @startTime AND @endTime
          AND MATB.VSerial IS NOT NULL
    `;

    if (model && model !== "0") {
      query += ` AND MATBM.MatCode = @model`;
    }

    query += " ORDER BY a.PSNo;";

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const request = pool
      .request()
      .input("startTime", sql.DateTime, istStart)
      .input("endTime", sql.DateTime, istEnd);

    if (model && model !== "0") {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);

    res.status(200).json({
      success: true,
      result: result.recordset,
    });

    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
