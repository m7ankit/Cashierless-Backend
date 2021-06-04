const { Order, ProductCart } = require('./models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(500).json({
                    error: "order not found"
                })
            }

            if (!order) {
                return res.status(401).json({
                    error: "order not found"
                })
            }
            // We get a product at this point
            req.order = order;
            next();
        })
}