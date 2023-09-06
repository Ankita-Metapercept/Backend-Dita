const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    projectName: { type: String, required: true }, 
    projectNodeId: { type: String, required: true },
    projectRepoId: { type: String, required: true },
    gitCloneUrl: { type: String, require: true },
    owner: { type: String, required: true },
    orgId: { type: String, required: true },
    orgAdminId: { type: String, required: true },
    gitCollaboratorsCount:  { type: Number, required: true },
    defaultBranch : {type:String,required:true},
    isDeleted: { type: Boolean, required: true },
    isFork: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
module.exports = mongoose.model('project', schema);