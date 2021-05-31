const User = require("../models/user")


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err) {
            return res.status(500).json({
                error: "user not found"
            })
        }

        if (!user) {
            return res.status(401).json({
                error: "user not found"
            })

        }
        // We get a user here
        req.profile = user;
        next();
    })
}

// Putting order in the user.purchase array
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    //Store this in DB
    // Not using $set as it is array
    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { purchases: purchases } }, { new: true },
        (err, purchaseList) => {
            if (err) {
                return res.status(400).json({
                    error: "unable to save purchase list"
                })
            }
            next();
        }

    )

}