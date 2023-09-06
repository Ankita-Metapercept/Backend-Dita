const docstylerServices = require("../../../services/orguser/docstyler/docstyler.js");

exports.customizePdfOutput = function (req, res, next) {
  docstylerServices
    .customizePdfOutput(req.body)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};
exports.uploadPdfLogo = function (req, res, next) {
  docstylerServices
    .uploadPdfLogo()
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};
exports.customizeHtmlOutput = function (req, res, next) {
  docstylerServices
    .customizeHtmlOutput(req.body)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};
exports.uploadHtmlLogo = function (req, res, next) {
  docstylerServices
    .uploadHtmlLogo()
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};
