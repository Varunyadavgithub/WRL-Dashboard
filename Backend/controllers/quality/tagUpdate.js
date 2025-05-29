import sql, { dbConfig1 } from "../../config/db.js";

export const getAssetTagDetails = async (req, res) => {
  const { assemblyNumber } = req.query;

  if (!assemblyNumber) {
    return res.status(400).json({
      success: false,
      message: "Assembly Number is required.",
    });
  }

  const query = `
    SELECT 
      mb.Serial + '~' + mb.VSerial + '~' + m.Alias AS combinedserial
    FROM 
      MaterialBarcode AS mb
    INNER JOIN 
      Material AS m ON m.MatCode = mb.Material
    WHERE 
      mb.Alias = @alias
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();

    const result = await pool
      .request()
      .input("alias", sql.VarChar, assemblyNumber)
      .query(query);

    const combined = result.recordset[0]?.combinedserial;

    if (!combined) {
      return res.status(404).json({
        success: false,
        message: "No data found for the provided alias.",
        FGNo: null,
        AssetNo: null,
        ModelName: null,
      });
    }

    const [FGNo, AssetNo, ModelName] = combined.split("~");

    res.status(200).json({
      success: true,
      FGNo,
      AssetNo,
      ModelName,
    });

    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const tagupdate = async (req, res) => {
  const { assemblyNumber, fgSerialNumber, newAssetNumber } = req.body;

  if (!assemblyNumber || !fgSerialNumber || !newAssetNumber) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    update MaterialBarcode set VSerial=@newAssetNumber where Alias=@serial and Serial=@fgSerialNumber
  `;

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("serial", sql.NVarChar, assemblyNumber)
      .input("fgSerialNumber", sql.NVarChar, fgSerialNumber)
      .input("newAssetNumber", sql.NVarChar, newAssetNumber)
      .query(query);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Asset Tag updated successfully.",
    });
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
