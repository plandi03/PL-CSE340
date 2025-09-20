const pool = require("../database/index")

// Get all vehicles (for optional list)
async function getInventory() {
  const { rows } = await pool.query("SELECT * FROM inventory ORDER BY inv_id")
  return rows
}

// Get single vehicle by ID
async function getVehicleById(inv_id) {
  const sql = `SELECT * FROM inventory WHERE inv_id = $1`
  const { rows } = await pool.query(sql, [inv_id])
  return rows[0] || null
}

module.exports = { getInventory, getVehicleById }
