import sql, { dbConfig1 } from "../../config/db.js";

export const getModelName = async (req, res) => {
  const { plan } = req.query;
  try {
    const query = `
      Select m.Alias, m.matcode from "PlanOrderPrint" as pop 
      join material m on m.matcode = pop.PlanMaterial where planType=@plan
    `;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool
      .request()
      .input("plan", sql.VarChar, plan)
      .query(query);

    res.status(200).json({ success: true, data: result.recordset });
    await pool.close();
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getPlanMonth = async (_, res) => {
  try {
    const query = `Select DISTINCT(PlanMonthYear) from "PlanOrderPrint"`;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const result = await pool.request().query(query);

    res.status(200).json({ success: true, data: result.recordset });
    await pool.close();
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const productionPlaningData = async (req, res) => {
  const { planType, planMonthYear, matcode } = req.query;

  // Only planType and planMonthYear are required
  if (!planType || !planMonthYear) {
    return res.status(400).send("planType and planMonthYear are required");
  }

  try {
    const pool = await new sql.ConnectionPool(dbConfig1).connect();
    const request = pool.request();

    request.input("planType", sql.VarChar, planType);
    request.input("planMonthYear", sql.Int, planMonthYear);

    if (matcode && matcode != 0) {
      request.input("matcode", sql.Int, matcode);
    }

    const query = `
      SELECT 
        PlanNo, PlanMonthYear, m.Alias, PlanQty, PrintLbl, PlanType, Remark, 
        u.username, CreatedOn 
      FROM PlanOrderPrint AS pop
      JOIN material m ON m.matcode = pop.PlanMaterial
      JOIN users u ON u.userCode = pop.CreatedBy
      WHERE planType = @planType AND PlanMonthYear = @planMonthYear
      ${matcode && matcode != 0 ? "AND pop.PlanMaterial = @matcode" : ""}
      order by PrintLbl desc
    `;

    const result = await request.query(query);

    res.status(200).json({ success: true, data: result.recordset });
    await pool.close();
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addProductionPlaningData = async (req, res) => {
  const { planQty, userCode, remark, matcode, planMonthYear, planType } =
    req.body;

  if (
    !planQty ||
    !userCode ||
    !remark ||
    !matcode ||
    !planMonthYear ||
    !planType
  ) {
    return res
      .status(400)
      .send(
        "planQty, userCode, remark, matcode, planMonthYear and planType are required"
      );
  }

  try {
    const query = `
      UPDATE PlanOrderPrint 
      SET PlanQty = @planQty, CreatedBy=@userCode, Remark = @remark 
      WHERE PlanMaterial = @matcode AND PlanMonthYear = @planMonthYear AND PlanType = @planType;
    `;

    const pool = await new sql.ConnectionPool(dbConfig1).connect();

    const result = await pool
      .request()
      .input("planQty", sql.NVarChar, planQty)
      .input("userCode", sql.Int, userCode)
      .input("remark", sql.NVarChar, remark)
      .input("matcode", sql.NVarChar, matcode)
      .input("planMonthYear", sql.NVarChar, planMonthYear)
      .input("planType", sql.NVarChar, planType)
      .query(query);

    res.status(200).json({
      success: true,
      rowsAffected: result.rowsAffected,
      payload: "Plan updated successfully",
    });
    await pool.close();
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
