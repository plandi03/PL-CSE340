const pool = require("../database/") // adjust if your path is different

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(fn, ln, email, pw) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [fn, ln, email, pw])
  } catch (err) {
    console.error(err)
    return null
  }
}

module.exports = { registerAccount }