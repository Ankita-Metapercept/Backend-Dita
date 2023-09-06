const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String, unique: true, required: true },
    orgId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    token: { type: String, required: true },
    refreshToken: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now  },
    // lastLoginIpAddress: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now  },
    createdAt: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('githubAuthToken', schema);