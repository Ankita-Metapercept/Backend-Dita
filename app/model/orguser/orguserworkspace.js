const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    userId: { type: String, required: true },
    orgId: { type: String, required: true },
    packeges: { type: [String], required: true },
    installedPath:{ type: String, required: true },
    isInstalled: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('orgUserWorkspace', schema);