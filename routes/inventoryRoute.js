const express = require("express")
const router = express.Router()
const { showVehicleDetail } = require("../controllers/invController")

// Detail route
router.get("/detail/:inv_id", showVehicleDetail)

module.exports = router
