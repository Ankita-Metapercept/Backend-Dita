const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    email: { type: String, required: true },
    orgUserId: { type: String, required: true },
    token: { type: String, required: true },
    purpose: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('orgUserEmailVerificationToken', schema);
