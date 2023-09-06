const express = require('express')
const DitaotVersionController = require('../../controllers/serveradmin/ditaotversions')
const router = express.Router()

router.post('/serveradmin/ditaotversion', DitaotVersionController.addVersion)
router.get('/serveradmin/ditaotversion', DitaotVersionController.getVersion)
router.get('/serveradmin/ditaotversion/byid', DitaotVersionController.getVersionById)

module.exports = router