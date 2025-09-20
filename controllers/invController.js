const { getVehicleById } = require("../models/inventory-model")
const { formatUSD, formatNumberWithCommas } = require("../utilities")

async function showVehicleDetail(req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id)
    if (!invId) throw { status: 404, message: "Invalid vehicle ID" }

    const vehicle = await getVehicleById(invId)
    if (!vehicle) throw { status: 404, message: "Vehicle not found" }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      formattedPrice: formatUSD(vehicle.inv_price),
      formattedMiles: formatNumberWithCommas(vehicle.inv_miles)
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { showVehicleDetail }
