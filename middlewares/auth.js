const expressJwt = require('express-jwt');

//Custom middleware for error handling in express-jwt
exports.isUnauthorized = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: "invalid token"
        });
    }
    next();
}

//Check if user is signed in 
exports.isSignedin = expressJwt({
    secret: process.env.SECRET,
    //By default, the decoded token is attached to req.user but can be configured with the requestProperty option.
    userProperty: "auth"
        //We can get it by request.auth - _id, iat 
})


exports.isAuthenticated = (req, res, next) => {
    // req.profile will be setup from frontend
    //req.auth will be set by isSignedIn middleware
    let checker = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "access denied"
        })
    }
    next();
}

//Custom middleware for customer routes
//If user is not customer, then it will return 403
exports.isCustomer = (req, res, next) => {
    if (!req.profile.role === 0) {
        return res.status(403).json({
            error: "access denied"
        })
    }
    next();
}

//Custom middleware for guard routes
//If user is not guard, then it will return 403
exports.isGuard = (req, res, next) => {
    if (!req.profile.role === 1) {
        return res.status(403).json({
            error: "access denied"
        })
    }
    next();
}

//Custom middleware for manager routes
//If user is not manager, then it will return 403
exports.isManager = (req, res, next) => {
    if (!req.profile.role === 2) {
        return res.status(403).json({
            error: "access denied"
        })
    }
    next();
}