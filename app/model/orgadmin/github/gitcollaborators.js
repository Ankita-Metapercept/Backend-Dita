const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    orgId: { type: String, required: true },
    gitUserId: { type: String, required: true },
    gitUsername: { type: String, required: true },
    isDelete: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date}
});
module.exports = mongoose.model('githubCollaborators', schema);