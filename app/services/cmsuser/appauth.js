// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const CMSUser = db.CMSUser;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const cmsuser = await CMSUser.findOne({ email });
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
    if (cmsuser && bcrypt.compareSync(password, cmsuser.hash)) {
        const token = jwt.sign({ sub: cmsuser.id }, secret, { expiresIn: '7d' });
        return {
            ...cmsuser.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await CMSUser.find();
}

async function getById(id) {
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        return await CMSUser.findById(id);
    }else{
        return (id)
    }
    // return await User.findById(id);
}

async function create(cmsuserParam) {
    // validate
    if (await CMSUser.findOne({ email: cmsuserParam.email })) {
        throw 'Email "' + cmsuserParam.email + '" is already taken';
    }

    const cmsuser = new CMSUser(cmsuserParam);

    // hash password
    if (cmsuserParam.password) {
        cmsuser.hash = bcrypt.hashSync(cmsuserParam.password, 10);
    }

    // save user
    await cmsuser.save();
}

async function update(id, cmsuserParam) {
    const cmsuser = await CMSUser.findById(id);

    // validate
    if (!cmsuser) throw 'cmsuser not found';
    if (cmsuser.email !== cmsuserParam.email && await User.findOne({ email: cmsuserParam.email })) {
        throw 'Email "' + cmsuserParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (cmsuserParam.password) {
        cmsuserParam.hash = bcrypt.hashSync(cmsuserParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(cmsuser, cmsuserParam);

    await cmsuser.save();
}

async function _delete(id) {
    await CMSUser.findByIdAndRemove(id);
}