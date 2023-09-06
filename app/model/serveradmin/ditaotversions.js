const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    versionLabel: { type: String, required: true },
    ditaotURL: { type: String, required: true },
    isEnable: { type: Boolean, required: true },
    createdDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ditaotVersion', schema);