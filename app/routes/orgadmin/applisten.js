const express = require('express')

const router = express.Router()

// const app = express()

const db = require('../../config/db');
const Admin = db.Admin

router.post('/admin/AuthenticationController', (req, res)=> {
    Admin.findOne({ email: req.body.email, org_name: req.body.org_name, org_id: req.body.org_id, org_url: req.body.org_url, org_domain: req.body.org_domain}).then((data)=> {
        if(data){
            // res.send(data)
            res.json({message: "found"}) 
        }
        else{
            res.json({message: "not found"})
        }
    }).catch((err)=> {
        res.send(err)
    })
})

module.exports = router