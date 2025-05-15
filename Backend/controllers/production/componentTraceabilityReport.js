import sql, { dbConfig1 } from "../../config/db.js";

export const generateReport = async (req, res) => {
  const { startTime, endTime, model } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "startTime and endTime are required",
    });
  }

  let query = `
DECLARE @AdjustedStartTime DATETIME, @AdjustedEndTime DATETIME;

-- Adjust both times to IST (UTC +5:30)
SET @AdjustedStartTime = DATEADD(MINUTE, 330, @startTime);
SET @AdjustedEndTime = DATEADD(MINUTE, 330, @endTime);

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
    AND b.ScannedOn BETWEEN @AdjustedStartTime AND @AdjustedEndTime
    AND MATB.VSerial IS NOT NULL
`;

  if (model && model != 0) {
    query += ` AND MATBM.MatCode = @model`;
  }

  query += " ORDER BY a.PSNo;";

  try {
    const pool = await sql.connect(dbConfig1);
    const request = pool
      .request()
      .input("startTime", sql.DateTime, new Date(startTime))
      .input("endTime", sql.DateTime, new Date(endTime));

    if (model && model != 0) {
      request.input("model", sql.VarChar, model);
    }

    const result = await request.query(query);
    res.status(200).json({
      success: true,
      result: result.recordset,
    });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Export Production Report to CSV
 */
// export const exportProductionReport = async (req, res) => {
//   try {
//     // Modify query to remove pagination and get all records
//     const query = `
//       SELECT
//         p.ProductionOrderNo,
//         p.CreatedOn,
//         m.MatCode AS ModelCode,
//         m.Name AS ModelName,
//         s.StationCode,
//         s.Name AS StationName,
//         p.Quantity,
//         p.Status
//       FROM
//         ProductionOrder p
//       INNER JOIN
//         Material m ON p.ModelCode = m.MatCode
//       INNER JOIN
//         WorkCenter s ON p.StationCode = s.StationCode
//       WHERE
//         p.CreatedOn BETWEEN @startTime AND @endTime
//         ${req.query.model ? 'AND m.MatCode = @modelName' : ''}
//         ${req.query.stationCode ? 'AND s.StationCode = @stationCode' : ''}
//       ORDER BY
//         p.CreatedOn DESC
//     `;

//     // Reuse connection and parameter logic from generateReport
//     const pool = await sql.connect(dbConfig);
//     const request = pool.request()
//       .input("startTime", sql.DateTime, new Date(req.query.startTime))
//       .input("endTime", sql.DateTime, new Date(req.query.endTime));

//     if (req.query.model) {
//       request.input("modelName", sql.NVarChar, req.query.model);
//     }

//     if (req.query.stationCode) {
//       request.input("stationCode", sql.NVarChar, req.query.stationCode);
//     }

//     const result = await request.query(query);

//     // Convert to CSV
//     const csvContent = convertToCSV(result.recordset);

//     // Set headers for file download
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=production_report.csv');
//     res.send(csvContent);

//   } catch (err) {
//     console.error("Production Report Export Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to export production report",
//       error: err.message
//     });
//   }
// };

/**
 * Convert array to CSV
 */
// const convertToCSV = (data) => {
//   if (!data || data.length === 0) return '';

//   // Extract headers dynamically
//   const headers = Object.keys(data[0]);

//   // Convert data to CSV rows
//   const csvRows = data.map(row =>
//     headers.map(header =>
//       `"${String(row[header] || '').replace(/"/g, '""')}"`
//     ).join(',')
//   );

//   // Combine headers and rows
//   return [headers.join(','), ...csvRows].join('\n');
// };
