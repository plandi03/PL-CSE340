const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail view
router.get("/detail/:inv_id", invController.buildVehicleDetail)

module.exports = router