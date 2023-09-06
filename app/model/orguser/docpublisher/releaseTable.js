const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    ditaMapFileName: { type: String, required: true },
    outputFormat: { type: String, required: true },
    ditaotVersion: { type: String, required: true },
    projectName : {type : String , required: true},
    orgId: { type: String, required: true },
    userId: { type: String, required: true },
    releaseTitle: { type: String, required: true },
    releasedBy: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("release", schema);
