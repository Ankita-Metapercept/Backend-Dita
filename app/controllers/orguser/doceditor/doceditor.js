const doceditorServices = require("../../../services/orguser/doceditor/doceditor.js");

exports.generateNodeId = function (req, res, next) {
    doceditorServices
      .generateNodeId(req.body)
      .then((data) => res.status(201).json(data))
      .catch((err) => next(err));
};

exports.editXml = function ( req,res,next){
    doceditorServices.editXml(req.body)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
}
exports.uploadDitaContentImg = function (req, res, next) {
    doceditorServices
      .uploadDitaContentImg()
      .then((data) => res.status(201).json(data))
      .catch((err) => next(err));
  };