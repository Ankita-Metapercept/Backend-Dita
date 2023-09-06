const gitCollaboratorServices = require('../../../services/orgadmin/github/gitcollaborators')
const express = require('express')
exports.addGitCollaborators = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let orgId = req.query.orgId
    if(orgId){
    gitCollaboratorServices.addGitCollaborators(gitToken, orgId)
        .then((collaboratorsDetails) =>{ 
            if(collaboratorsDetails){
                res.send({message: "Collaborators added successfully"})
            }else{
                res.send(collaboratorsDetails)
            }
        })
        .catch(err => next(err))
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.getGitCollaborators = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        gitCollaboratorServices.getGitCollaborators(orgId)
            .then(collaboratorsDetails => res.send(collaboratorsDetails))
            .catch(err => next(err))
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}