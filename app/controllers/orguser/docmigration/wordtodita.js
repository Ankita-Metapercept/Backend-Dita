const wordToDitaServices = require("../../../services/orguser/docmigration/wordtodita.js");

exports.uploadExtractsToWorkspace = function (req, res, next) {
  wordToDitaServices
    .uploadExtractsToWorkspace(req)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => next(err));
};
exports.convertToDita = function (req,res,next){
  wordToDitaServices
    .convertToDita(req)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
}
exports.downloadDitazip = function (req,res,next){
  wordToDitaServices
    .downloadDitazip(req,res)
    .then((data) => res.status(200).end(data,"binary"))
    .catch((err) => next(err));
};
exports.commitDitaFiles = function (req,res,next){
  wordToDitaServices
    .commitDitaFiles(req)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}
exports.getSyncedProjects = function (req, res, next) {
  wordToDitaServices
    .getSyncedProjects(req)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
};