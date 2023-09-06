const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../../config/db')
const User = db.serverAdmin
module.exports = {
    authenticate,
    create
};
async function authenticate({ email, password }) {
    const user = await User.findOne({ email })
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' })
        await User.findOneAndUpdate({email: user.email}, {lastLogin: Date.now()})
        return {
            ...user.toJSON(),
            token
        }
    }
}
async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }
    const user = new User(userParam);
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save();
}