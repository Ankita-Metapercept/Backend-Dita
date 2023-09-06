const expressJwt = require('express-jwt');
// const config = require('config.json');
const userService = require('../../services/orgadmin/appauth');

module.exports = jwt;

function jwt() {
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/orgadmin/authenticate',
            '/api/orgadmin/register',
            '/api/orgadmin/github',
            '/api/orgadmin/success',
            '/api/orgadmin/github/callback',
            '/api/orguser/authenticate',
            '/api/orgadmin/gituth/resettoken',
            '/api/orguser/github',
            '/api/orguser/github/success',
            '/api/orguser/github/callback',
            '/api/orgadmin/changepassword',
            '/api/orguser/emailverification',
            '/api/orgadmin/emailverification',
            '/api/orgadmin/forgotpassword',
            '/api/orgadmin/forgotPasswordTokenVerify',
            '/api/orgadmin/resetpassword',
            '/api/orgadmin/resetforgotpassword',
            '/api/generateSessionId'
        ]
    });
}