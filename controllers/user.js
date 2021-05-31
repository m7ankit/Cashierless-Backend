const User = require("../models/user");
const { Order } = require("../models/order");


exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, {
        new: true,
        useFindAndModify: false
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                error: "update not successful"
            })
        }

        if (!user) {
            return res.status(401).json({
                error: "user with given id does not exist."
            })
        }
        user.salt = undefined;
        user.encry_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        return res.json(user)
    });
}

exports.userOrderList = (req, res) => {
    try {
        Order.find({ user: req.profile._id })
            .populate("user", "_id name")
            .exec((err, order) => {
                if (err) {
                    return res.status(400).json({
                        error: "no orders"
                    });
                }
                return res.json(order)
            })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: "server error"
        });
    }

}