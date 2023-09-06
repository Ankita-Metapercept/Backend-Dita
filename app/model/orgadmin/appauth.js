const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    orgId: { type: String, required: true }, 
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    rawpassword: { type: String, required: true },
    name: { type: String, required: true },
    githubUsername: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, required: true },
    isChangePassword: { type: Boolean, required: true },
    contact: { type: String },
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
module.exports = mongoose.model('orgAdmin', schema);