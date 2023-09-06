const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  orgId: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  rawpassword: { type: String, required: true },
  username: { type: String, required: true },
  githubCollaboratorId: { type: String, required: true },
  projects: { type: [String], required: true },
  userRole: { type: [String], required: true , default:[] },
  githubEmail: { type: String, required: true },
  githubUsername: { type: String, required: true },
  adminId: { type: String, required: true },
  lastLoginId: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  isProfileUpdate: { type: Boolean, required: true },
  isRoleAssign: { type: Boolean, required: true },
  isEmailVerified: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
  isDeleted: { type: Boolean, required: true },
  isSuperUser: { type: Boolean, required: true },
  deletedAt: { type: Date },
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

module.exports = mongoose.model('orgUser', schema);