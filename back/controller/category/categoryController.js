const db = require("../../database/mysql");

const fetchCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT category_id, name FROM CATEGORIES");
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({
            message: "Categories fetched successfully",
            data: rows
        })
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ message: "Server error while fetching categories" });
    }
};

const fetchCategory = async (req, res) => {
    try {

        const { category_id } = req.params;

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

         const [rows] = await db.query("SELECT category_id, name FROM CATEGORIES WHERE category_id = ?",[category_id])

        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({message: "Category fetched successfully",data: rows[0] 
        })
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).json({ message: "Server error while fetching category" });
    }
}

module.exports = { fetchCategories, fetchCategory };