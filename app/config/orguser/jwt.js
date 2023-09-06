const expressJwt = require('express-jwt');

module.exports = jwt;

function jwt() {
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/orguser/github',
            '/api/orguser/success',
            '/api/orguser/github/callback',
            '/api/orguser/authenticate',
            '/api/orguser/gituth/resettoken'
        ]
    });
}