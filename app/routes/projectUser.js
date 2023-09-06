const express = require('express')

const router = express.Router()

var projectUserApi = require('../controllers/projectUser.js')
const db = require('../config/db')


const app = express()

router.post('/projectUser', projectUserApi.addProjectUser)
router.post('/updateProjectUserInvitation', projectUserApi.updateProjectUserInvitation)
router.get('/projectUser/:id', projectUserApi.getOneProjectUser)
router.get('/projectUserByName/:projectName', projectUserApi.getProjectUser)


module.exports = router