const { Order, ProductCart } = require('./models/order');

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "failed to save your order"
            })
        }
        return res.json(order)
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, orders) => {
            if (err) {
                return res.status(500).json({
                    error: "cannot get all orders"
                })
            }
            return res.json(orders)
        })
}


exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(500).json({
                    error: "cannot update order status"
                })
            }
            return res.json(order)
        }
    )
}