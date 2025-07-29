const db = require("../../database/mysql")

const fetchLocations = async (req, res) => {
    try {
        const [locations] = await db.query(`SELECT * FROM locations ORDER BY county, town`)
        return res.status(200).json({ success: true, locations })
    } catch (error) {
        console.error("Fetch locations error:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch locations" })
    }
};

const fetchLocation = async (req, res) => {
    const { location_id } = req.params;
    try {
        const [locations] = await db.query(`SELECT * FROM locations WHERE location_id = ?`, [location_id]);
        if (!locations.length) {
            return res.status(404).json({ success: false, error: "Location not found" });
        }
        return res.status(200).json({ success: true, location: locations[0] });
    } catch (error) {
        console.error("Fetch location error:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch location" });
    }
};

module.exports = { fetchLocations, fetchLocation }