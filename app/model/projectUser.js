const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectuserschema = new Schema({
    projectName: { type: String, required: true },
    projectId: { type: String, required: true },
    projectnode_id: { type: String, required: true },
    appUserName: {type: String, required: true},
    appUserEmail: {type: String, require: true},
    gitUserName: {type: String, require: true},
    gitUserEmail: {type: String, require: true},
    userRole: {type: String, require: true},
    acceptInvitation: {type: Boolean, require: true },
    createdDate: { type: Date, default: Date.now }
});

projectuserschema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash
    }
});

// module.exports = mongoose.model('projectUser', projectuserschema)