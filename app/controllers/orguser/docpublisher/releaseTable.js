const releasedByServices = require("../../../services/orguser/docpublisher/releaseTable.js");

exports.addRelease = function (req, res, next) {
  releasedByServices
    .addRelease(req.body)
    .then((releaseData) => res.status(201).json(releaseData))
    .catch((err) => next(err));
};
exports.getReleaseByUserId = function (req, res, next) {
  const userId = req.query.userId;
  if (userId) {
    releasedByServices
      .getReleaseByUserId(userId)
      .then((releaseTables) => res.status(201).json(releaseTables))
      .catch((err) => next(err));
  } else {
    res.status(400).json({ message: "userId not found in requeset query" });
  }
};
exports.getReleaseByOrgId = function (req, res, next) {
  const orgId = req.query.orgId;
  if (orgId) {
    releasedByServices
      .getReleaseByOrgId(orgId)
      .then((releaseTables) => res.status(201).json(releaseTables))
      .catch((err) => next(err));
  } else {
    res.status(400).json({ message: "orgId not found in requeset query" });
  }
};
exports.getReleaseById = function (req, res, next) {
  const id = req.query.Id;
  if (id) {
    releasedByServices
      .getReleaseById(id)
      .then((releaseTable) => res.status(201).json(releaseTable))
      .catch((err) => next(err));
  } else {
    res.status(400).json({ message: "Id not found in requeset query" });
  }
};
exports.updateRelease = function (req, res, next) {
  const id = req.query.Id;
  if (id) {
    releasedByServices
      .updateRelease(id, req.body)
      .then((updatedTable) => res.status(201).json(updatedTable))
      .catch((err) => next(err));
  } else {
    res.status(400).json({ message: "Id not found in requeset query" });
  }
};
exports.deleteRelease = function (req, res, next) {
  const id = req.query.Id;
  if (id) {
    releasedByServices
      .deleteRelease(id)
      .then(() =>
        res.status(200).json({ message: "releaseTable deleted successfully" })
      )
      .catch((err) => next(err));
  } else {
    res.status(400).json({ message: "Id not found in requeset query" });
  }
};
