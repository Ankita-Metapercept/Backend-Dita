const express = require('express')

const router = express.Router()

var AppAuth = require('../../controllers/aws-sdk/gits3data.js')
// const express = require('express');
const jwt = require('../../config/jwt');
const db = require('../../config/db');
const User = db.gits3data;

const app = express()

app.use(jwt());

// router.get('/', AppAuth.testapi)
// router.post('/authenticate', AppAuth.authenticate);
router.post('/gitaws/register', AppAuth.register);
router.get('/gitaws/users', AppAuth.getAll);

router.put('/gitaws/update', (req, res)=> {
    User.updateOne(
        { repopath: req.body.repopath },
        { $addToSet: { fileData: [req.body.fileData] } },
      ).then((newres)=> {
        res.send(newres)
      }).catch((err)=> {
        res.send(err)
      })
});

router.get('/gitaws/repodata', (req, res)=>{
    User.findOne({ repopath: req.header('repopath') }).then((newres)=>{
        res.send(newres)
    }).catch((err)=>{
        res.send(err)
    })
});

router.delete('/gitaws/delete/:id', AppAuth._delete);

module.exports = router

// const express = require('express')

// const router = express.Router()

// var AppAuth = require('../../controllers/aws-sdk/gits3data.js')
// const jwt = require('../../config/jwt');
// const db = require('../../config/db');
// const User = db.gits3data;

// const app = express()

// app.use(jwt());

// router.post('/gits3/register', AppAuth.register);
// router.get('/gits3/users', AppAuth.getAll);
// router.delete('/gits3/delete', AppAuth._delete);

// module.exports = router