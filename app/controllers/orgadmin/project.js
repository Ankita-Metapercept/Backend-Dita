const adminService = require('../../services/orgadmin/project');
const express = require('express');

// get project list with github collaborator count and project user count
exports.getOrgProjectList = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        adminService.getOrgProjectList( orgId)
            .then(users => res.send(users))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.getProjectFileCount = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let orgId = req.query.orgId
    if(orgId){
        adminService.getProjectFileCount(gitToken, orgId)
        .then((collaboratorsDetails) =>{ 
        res.json(collaboratorsDetails)    
    })
        .catch(err => next(err))
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}