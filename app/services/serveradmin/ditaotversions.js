const db = require('../../config/db')
const DitaotVersion = db.ditaotVersion
module.exports = {
    addVersion,
    getVersion,
    getVersionById
};
// add dita ot version plan
async function addVersion(versionParam) {
    const ditaotversion = new DitaotVersion(versionParam);
    await ditaotversion.save();
}
// get list of all dita ot version details
async function getVersion() {
    try{
        return await DitaotVersion.find()
    }
    catch(err){
        return err
    }      
}
// get dita ot version details by id
async function getVersionById(id) {
    try{
        return await DitaotVersion.findOne({_id: id})
    }
    catch(err){
        return err
    }
}