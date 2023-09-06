const db = require('../config/db');
const User = db.projectUser;

exports.addProjectUser = async function(req, res) {
    var projectParam = req.body;

    const user = new User(projectParam);

    // save user
    await user.save().then((resdata) => {
        res.send(resdata)
    }).catch((err)=> {
        res.send(err)
    })
}

exports.updateProjectUserInvitation = async function(req, res) {
    var project_Id = req.body.projectId
    var gituser_Name = req.body.gitUserName
    const filter = {projectId: project_Id, gitUserName: gituser_Name}
    User.findOne(filter).then((newdata)=> {
        Object.assign(newdata, {acceptInvitation: true})
        newdata.save().then((data)=> {
            res.send(data)
        }).catch((err)=> {
            res.send(err)
        })
    }).catch((err)=> {
        res.send(err)
    })
}

exports.getOneProjectUser = async function(req, res) {
    var id = req.params.id
    await User.find({ "projectId": id }).then((resdata)=> {
        res.send(resdata)
    }).catch((err)=> {
        res.send(err)
    })
}

exports.getProjectUser = async function(req, res) {
    var id = req.params.projectName
    await User.find({ "projectName": id }).then((resdata)=> {
        res.send(resdata)
    }).catch((err)=> {
        res.send(err)
    })
}