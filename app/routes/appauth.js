const express = require('express')

const router = express.Router()

var AppAuth = require('../controllers/appauth.js')
const jwt = require('../config/jwt');
const db = require('../config/db');
const User = db.User;

const app = express()

app.use(jwt());

router.post('/authenticate', AppAuth.authenticate);
router.post('/register', AppAuth.register);
router.get('/users', AppAuth.getAll);
router.put('/userUpdate/:userId', async(req, res)=> {
    var access_token = req.header('access_token')
    var user_token = req.header('user_token')
    var user_id = req.params.userId
    var userParam = req.body
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
router.put('/:id', AppAuth.update);
router.delete('/:id', AppAuth._delete);
router.get("/generateSessionId",AppAuth.generateSessionId)

module.exports = router