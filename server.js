/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require('./database/')

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})




/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Navigation Middleware - Makes nav available to all views
 *************************/
app.use(async (req, res, next) => {
  try {
    const utilities = require("./utilities")
    res.locals.nav = await utilities.getNav()
    next()
  } catch (error) {
    console.error("Navigation middleware error:", error)
    res.locals.nav = "<ul><li><a href='/'>Home</a></li></ul>"
    next()
  }
})

/* ***********************
 * Routes
 *************************/
app.use(static)

// Regular routes
const inventoryRoutes = require("./routes/inventoryRoute")
app.use("/inventory", inventoryRoutes)

// Error handling route for Task 3
app.get("/error", (req, res, next) => {
  const error = new Error("Intentional server error for testing")
  error.status = 500
  next(error)
})

// Index route  
app.get("/", function(req, res) {
  res.render("index", { title: "Home" })
})

// 404 Error handler - This should be AFTER all other routes
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`)
  error.status = 404
  next(error)
})

// Error handling middleware - This should be LAST
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || "Internal Server Error"
  
  console.error("Error occurred:", err)
  
  res.status(status)
  res.render("errors/error", {
    title: `Error ${status}`,
    message: message,
    status: status
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

