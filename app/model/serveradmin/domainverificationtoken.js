const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    orgId: { type: String, required: true }, 
    token: { type: String, required: true },
    adminId: { type: String, required: true },
    purpose: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: Date.now }
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
module.exports = mongoose.model('domainVerificationToken', schema);