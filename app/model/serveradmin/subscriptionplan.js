const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    title: { type: String, required: true }, 
    level: { type: Number, required: true, unique: true },
    userCount: { type: Number, required: true },
    adminCount: { type: Number, required: true },
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
module.exports = mongoose.model('subscriptionPlan', schema);