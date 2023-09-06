const express = require('express')

const router = express.Router()

var TestApi = require('../controllers/projectDetails.js')
const db = require('../config/db');
const User = db.projectDetails;


const app = express()

router.post('/projectDetails', TestApi.testapi)
router.get('/projectDetails/:id', TestApi.getOneProjectDetails)


module.exports = router