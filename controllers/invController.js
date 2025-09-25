const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0]?.classification_name || "Unknown"
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      grid,
      currentClassification: classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view with navigation filter
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getVehicleById(inv_id)
    
    if (!vehicle) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    // Get vehicles in the same classification for filtering
    const sameClassificationVehicles = await invModel.getInventoryByClassificationId(vehicle.classification_id)
    
    // Build navigation filter for current classification
    const classificationFilter = utilities.buildClassificationFilter(sameClassificationVehicles, inv_id)
    
    const vehicleTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    
    res.render("./inventory/detail", {
      title: vehicleTitle,
      vehicle,
      formattedPrice: utilities.formatUSD(vehicle.inv_price),
      formattedMiles: utilities.formatNumberWithCommas(vehicle.inv_miles),
      classificationFilter,
      currentClassification: vehicle.classification_id,
      classificationName: sameClassificationVehicles[0]?.classification_name || "Unknown"
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont