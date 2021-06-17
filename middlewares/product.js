const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(500).json({
          error: "product not found",
        });
      }

      if (!product) {
        return res.status(401).json({
          error: "product not found",
        });
      }
      // We get a product at this point
      req.product = product;
      next();
    });
};

//Middleware for loading photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// To deduct the stock and add to the sold attribute in the product model
// count will come from frontend
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id }, //ones we find a product at this line, we get to next
        update: {
          $inc: {
            stock: -product.count,
            sold: +product.count,
          },
        }, // product.count will be given from frontend
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, resultOperation) => {
    if (err) {
      return res.status(400).json({
        error: "bulk operation failed",
      });
    }
  });
};
