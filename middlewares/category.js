const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(500).json({
                error: "category not found"
            })
        }

        if (!category) {
            return res.status(401).json({
                error: "category not found"
            })
        }
        // We get a category at this point
        req.category = category;
        next();
    })
}