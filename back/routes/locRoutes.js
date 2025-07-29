const express = require("express")
const {fetchLocations,fetchLocation} = require("../controller/location/locController")

const locRoutes = express.Router()

locRoutes.get("/locations",fetchLocations)
locRoutes.get("/locations/:location_id",fetchLocation)

module.exports = locRoutes