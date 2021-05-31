const { isSignedin, isAuthenticated, isManager } = require("../middlewares/auth");
const Category = require("../models/category");

function isEmptyObject(obj) {
    if (obj //null and undefined check
        &&
        Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
    }
    return false;
}

exports.createCategory = (req, res) => {

    if (isEmptyObject(req.body)) {
        return res.status(400).json({
            error: "empty body"
        });
    }
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "category addition not successful"
            });
        }
        return res.status(201).json({ category });
    })

}

exports.getCategory = (req, res) => {
    //middleware sets up req.category already
    return res.json(req.category);
}

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: "categories not found"
            });
        }
        return res.json(categories)
    })
}

exports.updateCategory = (req, res) => {
    if (isEmptyObject(req.body)) {
        return res.status(400).json({
            error: "empty body"
        });
    }
    const category = req.category;
    category.name = req.body.name;
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "category update not successful"
            })
        }
        return res.json(category)
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "failed to delete category"
            });
        }
        return res.json({ category, deleted: true });
    });
}