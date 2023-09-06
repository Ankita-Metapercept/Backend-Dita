const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appUser = new Schema({
    userName: { type: String, required: true },
    Email: { type: String, required: true  },
})

const gitUser = new Schema({
    userName: { type: String, required: true },
    Email: { type: String, required: true  },
})

const userRole = new Schema({
    appUser: {type: appUser},
    gitUser: {type: gitUser},
    userrole: { type: String, required: true }
})

const projectschema = new Schema({
    projectName: { type: String, required: true },
    projectId: { type: String, required: true },
    projectnode_id: { type: String, required: true },
    userRole: [userRole],
//     {
//         "projectName": "project1",
//         "projectId": "p123451",
//         "userRole": [{
            
//                 "appUser": {
//                    "userName": "AUser1",
//                    "Email": "auser1@gmail.com"    
//                 },
//                 "gitUser": {
//                    "userName": "GUser1",
//                    "Email": "guser1@gmail.com"
//                 },
//                "userrole": "Author"
//             },
//             {
//                 "appUser": {
//                    "userName": "AUser2",
//                 "Email": "auser2@gmail.com"    
//                 },
//                 "gitUser": {
//                     "userName": "GUser2",
//                 "Email": "guser2@gmail.com"
//                 },
//                "userrole": "Author"
//          }]
//    }


    // userInfo: [userInfo],
    createdDate: { type: Date, default: Date.now }
});

projectschema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash
    }
});

module.exports = mongoose.model('projectDetails', projectschema)