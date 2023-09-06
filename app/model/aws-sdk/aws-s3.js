const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    repopath: { type: String, required: true },
    fileData: [
        {
            path: { type: String, required: true },
            content: { type: String, required: true }
        }
    ] 
});

module.exports = mongoose.model('gits3data', schema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const schema = new Schema({
//     path: { type: String, unique: true, required: true },
//     content: { type: String, required: true },
//     createdDate: { type: Date, default: Date.now }
// });

// schema.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: function (doc, ret) {
//         delete ret._id;
//         delete ret.hash;
//     }
// });

// module.exports = mongoose.model('gits3data', schema);