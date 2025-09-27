const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    let list = "<ul class='main-nav'>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inventory/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  } catch (error) {
    console.error("Navigation generation error: " + error)
    return "<ul class='main-nav'><li><a href='/'>Home</a></li></ul>"
  }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inventory/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inventory/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * Build classification filter for vehicle detail page
 ************************** */
Util.buildClassificationFilter = function(vehicles, currentVehicleId) {
  if (!vehicles || vehicles.length === 0) return ""
  
  let filter = '<div class="classification-filter">'
  filter += '<h3>Browse ' + vehicles[0].classification_name + ' Vehicles:</h3>'
  filter += '<div class="vehicle-filter-grid">'
  
  vehicles.forEach(vehicle => {
    const isCurrentVehicle = vehicle.inv_id == currentVehicleId
    const activeClass = isCurrentVehicle ? ' class="active-vehicle"' : ''
    
    filter += '<div class="filter-vehicle-item"' + activeClass + '>'
    if (isCurrentVehicle) {
      filter += '<div class="current-indicator">Currently Viewing</div>'
    }
    filter += '<a href="/inventory/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    filter += '<img src="' + vehicle.inv_thumbnail + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
    filter += '<div class="filter-info">'
    filter += '<h4>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h4>'
    filter += '<span class="filter-price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    filter += '</div>'
    filter += '</a>'
    filter += '</div>'
  })
  
  filter += '</div>'
  filter += '</div>'
  
  return filter
}

/* ************************
 * Format number as USD currency
 ************************** */
Util.formatUSD = function(amount) {
  if (typeof amount !== 'number') amount = Number(amount) || 0
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(amount)
}

/* ************************
 * Format number with commas
 ************************** */
Util.formatNumberWithCommas = function(value) {
  if (typeof value !== 'number') value = Number(value) || 0
  return value.toLocaleString('en-US')
}

/* ************************
 * Build vehicle detail HTML
 ************************** */
Util.buildVehicleDetailHTML = function(vehicle) {
  if (!vehicle) return '<p>Vehicle details not available.</p>'

  const price = Util.formatUSD(Number(vehicle.inv_price))
  const miles = Util.formatNumberWithCommas(Number(vehicle.inv_miles))
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h2>${title}</h2>
        <div class="vehicle-specs">
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Mileage:</strong> ${miles} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color || 'N/A'}</p>
          <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        </div>
        <div class="vehicle-description">
          <h3>Description</h3>
          <p>${vehicle.inv_description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  `
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util