//Custom middleware for error handling in express-jwt
var isUnauthorized = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: "invalid token"
        });
    }
    next();
}

module.exports = {
    isUnauthorized: isUnauthorized
}