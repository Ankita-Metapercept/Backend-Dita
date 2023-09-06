const express = require('express')

const router = express.Router()

var AppAuth = require('../../controllers/cmsuser/appauth.js')
// const express = require('express');
const jwt = require('../../config/jwt');
const db = require('../../config/db');
const User = db.User;

const app = express()

app.use(jwt());

// router.get('/', AppAuth.testapi)
router.post('/cmsuser/authenticate', AppAuth.authenticate);
router.post('/cmsuser/register', AppAuth.register);
router.get('/cmsuser', AppAuth.getAll);
// router.get('/current', AppAuth.getCurrent);
// router.get('/:id', AppAuth.getById);
router.put('/cmsuserUpdate/:userId', async(req, res)=> {
    // res.send("working userrole")
    var access_token = req.header('access_token')
    var user_token = req.header('user_token')
    var user_id = req.params.userId
    var userParam = req.body
    // res.send(userParam)
    const user = await User.findById(user_id);

    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    Object.assign(user, userParam);

    await user.save().then((resdata) => {
        res.send(resdata)
    })
})
router.put('/cmsuser/:id', AppAuth.update);
router.delete('/cmsuser/:id', AppAuth._delete);

module.exports = router