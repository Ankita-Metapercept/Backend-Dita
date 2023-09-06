// const express = require('express');
const db = require('../config/db');
const User = db.projectDetails;

exports.testapi = async function(req, res) {
    // res.send("working")
    // if (await User.findOne({ username: userParam.username })) {
    //     throw 'Username "' + userParam.username + '" is already taken';
    // }
    var projectParam = req.body;

    const user = new User(projectParam);

    // hash password
    // if (userParam.password) {
    //     user.hash = bcrypt.hashSync(userParam.password, 10);
    // }

    // save user
    await user.save().then((resdata) => {
        res.send(resdata)
    }).catch((err)=> {
        res.send(err)
    })
}

exports.getOneProjectDetails = async function(req, res) {
    var id = req.params.id
    await User.find({ "projectId": id }).then((resdata)=> {
        res.send(resdata)
    }).catch((err)=> {
        res.send(err)
    })
}