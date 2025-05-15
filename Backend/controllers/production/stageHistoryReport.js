import sql, { dbConfig1 } from "../../config/db.js";

export const getCurrentStageStatus = async (req, res) => {
  const { serialNumber } = req.query;

  if (!serialNumber) {
    return res.status(400).json({
      success: false,
      message: "Serial number is required",
    });
  }

  let query = `
WITH Psno AS (
    SELECT DocNo, Material, Serial, VSerial, Serial2, Alias 
    FROM MaterialBarcode 
    WHERE Serial = @serialNumber OR Alias = @serialNumber
)
SELECT 
    Psno.DocNo AS PSNO,
    M.Name AS MaterialName,
    B.StationCode,
    B.Name AS StationName,
    B.Alias AS StationAlias,
    A.ActivityOn,
    Psno.Serial2,
    Psno.VSerial,
    Psno.Alias AS BarcodeAlias,
    Psno.Serial,
    A.ActivityType,
    C.Type AS ActivityTypeName
FROM 
    Psno
INNER JOIN 
    ProcessActivity A ON Psno.DocNo = A.PSNO
INNER JOIN 
    WorkCenter B ON A.StationCode = B.StationCode
INNER JOIN 
    Material M ON Psno.Material = M.MatCode
LEFT JOIN 
    ProcessActivityType C ON C.id = A.ActivityType
ORDER BY 
    A.ActivityOn DESC;

    `;

  try {
    const pool = await sql.connect(dbConfig1);
    const request = pool
      .request()
      .input("serialNumber", sql.NVarChar, serialNumber);

    const result = await request.query(query);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// export const getBulkStageStatus = async (req, res) => {
//     // Extract serial numbers from request body
//     const { serialNumbers } = req.body;

//     // Validate input
//     if (!serialNumbers || !Array.isArray(serialNumbers) || serialNumbers.length === 0) {
//         return res.status(400).json({
//             success: false,
//             message: "Array of serial numbers is required"
//         });
//     }

//     // Limit the number of serial numbers to prevent overwhelming the database
//     const MAX_SERIAL_NUMBERS = 100;
//     if (serialNumbers.length > MAX_SERIAL_NUMBERS) {
//         return res.status(400).json({
//             success: false,
//             message: `Maximum ${MAX_SERIAL_NUMBERS} serial numbers allowed`
//         });
//     }

//     // Construct bulk query
//     const query = `
//         SELECT
//             a.Serial,
//             a.BarcodeNo,
//             a.DocNo,
//             b.CurrentProcess,
//             ISNULL(c.Name, 'NA') AS ProcessName,
//             b.NextProcess,
//             a.QCStatus
//         FROM
//             MaterialBarcode a
//         INNER JOIN
//             ProcessOrder b ON a.DocNo = b.PSNo
//         LEFT JOIN
//             ProductionProcess c ON c.ProcessCode = b.NextProcess
//         WHERE
//             a.Serial IN (${serialNumbers.map((_, i) => `@serialNumber${i}`).join(', ')})
//     `;

//     try {
//         // Establish database connection
//         const pool = await sql.connect(dbConfig);

//         // Prepare request with multiple parameters
//         const request = pool.request();
//         serialNumbers.forEach((sn, i) => {
//             request.input(`serialNumber${i}`, sql.NVarChar, sn);
//         });

//         // Execute query
//         const result = await request.query(query);

//         // Return results
//         res.status(200).json({
//             success: true,
//             totalRecords: result.recordset.length,
//             data: result.recordset
//         });

//     } catch (error) {
//         console.error('Bulk Stage Status Fetch Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve bulk stage status',
//             error: error.message
//         });
//     } finally {
//         await sql.close();
//     }
// };
