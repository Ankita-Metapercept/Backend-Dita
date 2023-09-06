const orgUserService = require('../../../services/orguser/docpublisher/docpublish');
const express = require('express');
exports.docPublish = function(req, res, next) {
    orgUserService.docPublish(req.body)
        .then((user) => res.send(user))
        .catch(err => next(err));
}