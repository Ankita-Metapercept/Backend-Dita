const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    repopath: { type: String, required: true },
    eventData: [
        {
            sha: { type: String, required: true },
            repoId: { type: String, required: true }
        }
    ]
})

module.exports = mongoose.model('githubtrepoevent', schema);