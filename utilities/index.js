// utilities/index.js

function formatUSD(amount) {
  if (typeof amount !== 'number') amount = Number(amount) || 0
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function formatNumberWithCommas(value) {
  if (typeof value !== 'number') value = Number(value) || 0
  return value.toLocaleString('en-US')
}

/**
 * Generate HTML snippet for a vehicle
 */
function buildVehicleDetailHTML(vehicle) {
  if (!vehicle) return '<p>Vehicle details not available.</p>'

  const price = formatUSD(Number(vehicle.inv_price))
  const miles = formatNumberWithCommas(Number(vehicle.inv_miles))
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

  return `
    <article class="vehicle-detail">
      <h2 class="sr-only">${title}</h2>

      <p><strong>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</strong></p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Mileage:</strong> ${miles} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color || 'N/A'}</p>

      <section aria-labelledby="desc-heading">
        <h3 id="desc-heading">Description</h3>
        <p>${vehicle.inv_description || 'No description available.'}</p>
      </section>
    </article>
  `
}

module.exports = { formatUSD, formatNumberWithCommas, buildVehicleDetailHTML }
