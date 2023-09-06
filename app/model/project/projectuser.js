const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    projectId: { type: String, required: true },
    projectName : {type:String ,required : true}, 
    userId: { type: String, required: true },
    githubUsername: { type: String, required: true },
    githubEmail: { type: String, required: true },
    githubUserId: { type: String, required: true },
    userRole: { type: [String], required: true },
    acceptInvitation: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
module.exports = mongoose.model('projectUser', schema);