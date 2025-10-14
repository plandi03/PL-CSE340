const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view (PUBLIC)
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail view (PUBLIC)
router.get("/detail/:inv_id", invController.buildVehicleDetail)

// Route to build management view (PROTECTED - Employee/Admin only)
router.get("/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)

// Route to build add classification view (PROTECTED)
router.get("/add-classification", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to build add inventory view (PROTECTED)
router.get("/add-inventory", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to process add classification (PROTECTED)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to process add inventory (PROTECTED)
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to build edit inventory view (PROTECTED)
router.get("/edit/:inv_id", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)

// Route to process the update (PROTECTED)
router.post("/update", 
  utilities.checkAccountType,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view (PROTECTED)
router.get("/delete/:inv_id", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

// Route to process the delete (PROTECTED)
router.post("/delete", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router