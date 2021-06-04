const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //filesystem
const Product = require("../models/product");
const { validationResult } = require("express-validator");

function isEmptyObject(obj) {
    if (obj //null and undefined check
        &&
        Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
    }
    return false;
}

exports.createProduct = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        //Destructuring the fields
        const { name, description, price, category, stock } = fields;
        if (!name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "required fields not given"
            })
        }

        let product = new Product(fields);
        //300Kb max size default
        if (file.photo) {
            if (file.photo.size > (process.env.MAX_IMAGE_SIZE || 300000)) {
                return res.status(400).json({
                    error: "image size too large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "saving product failed"
                })
            }
            return res.json(product);
        })
    });
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined; //photo will not be transfered
    return res.json(req.product);
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "failed to delete product"
            });
        }
        return res.json({ product, deleted: true });
    });
}

exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // updating with lodash
        let product = req.product;
        product = _.extend(product, fields)
            //300Kb max size default
        if (file.photo) {
            if (file.photo.size > (process.env.MAX_IMAGE_SIZE || 300000)) {
                return res.status(400).json({
                    error: "image size too large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "updating product failed"
                })
            }
            return res.json(product);
        })
    });

}

// Returns all the products from DB
// limit is passed in url query or by default 10 products are sent
// default sorting by _id
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let sortBy = req.query.sort ? req.query.sort : "price";
    Product.find()
        .select("-photo") // Not selecting photos as they are large
        .populate("category")
        .sort([
            [sortBy, "asc"]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "no products"
                })
            }
            return res.json(products);
        })
}


exports.getAllDistinctCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "categories not found"
            });
        }
        return res.json(categories)
    });
}