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
})