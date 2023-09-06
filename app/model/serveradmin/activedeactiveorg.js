const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    reason: { type: String, required: true },
    orgId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('activeDeactiveOrg', schema);