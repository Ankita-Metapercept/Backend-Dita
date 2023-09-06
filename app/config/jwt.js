const expressJwt = require('express-jwt');
// const config = require('config.json');
const userService = require('../services/appauth.js');

module.exports = jwt;

function jwt() {
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/api/authenticate',
            '/api/register',
            '/api/github',
            '/api/success',
            '/api/github/callback',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};