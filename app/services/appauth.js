// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const User = db.User;
const { v4: uuidv4 } = require("uuid");
const sessionIdList = {}
module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    generateSessionId,
    sessionIdList
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        return await User.findById(id);
    }else{
        return (id)
    }
    // return await User.findById(id);
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

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function generateSessionId(userId){
    sessionIdList[userId] = uuidv4()
    return { message : sessionIdList[userId]}
}