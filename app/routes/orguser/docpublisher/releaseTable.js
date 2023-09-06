const express = require("express");
const router = express.Router();
const releaseController = require("../../../controllers/orguser/docpublisher/releaseTable.js");

router.post("/orguser/release", releaseController.addRelease);
router.get("/orguser/release/byuserId", releaseController.getReleaseByUserId);
router.get("/orguser/release/byorgId", releaseController.getReleaseByOrgId);
router.get("/orguser/release/byId", releaseController.getReleaseById);
router.put("/orguser/release/update", releaseController.updateRelease);
router.delete("/orguser/release", releaseController.deleteRelease);

module.exports = router;
