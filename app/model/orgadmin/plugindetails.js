const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    packageName: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    transtype: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('pluginDetails', schema);