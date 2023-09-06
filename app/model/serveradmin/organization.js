const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    customId: { type: String, unique: true, required: true }, 
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    orgGithubURL: { type: String, unique: true, required: true },
    ditaotVersion: { type: String, required: true },
    isDomainVerified: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    accessURL: { type: String, required: true },
    adminHostURL:{ type: String, required: true },
    userHostURL:{ type: String, required: true },
    docManager: { type: Boolean, required: true },
    docMigration: {type: Boolean,required: true},
    docMigrationType: {type: [String], required: true},
    editor: { type: Boolean, required: true },
    publisher: { type: Boolean, required: true },
    contact: { type: String },
    fileCount: { type: Number, default: 0, required: true },
    numberofUser: { type: Number, required: true },
    numberofAdmin: { type: Number, required: true },
    planId: { type: String,  required: true },
    subscriptionRef:[{ type: mongoose.Schema.Types.ObjectId, ref: "subscription" }],
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
module.exports = mongoose.model('organization', schema);