const db = require('../../config/db')
const PluginDetails = db.pluginDetails

module.exports = {
    addDetails,
    getDetails
};
// add plugin details
async function addDetails(pluingParams) {
    try{
        const plugindetails = new PluginDetails(pluingParams);

        await plugindetails.save();
    }
    catch(err){
        console.log(err)
    }
}
// Get Details
async function getDetails() {
    try{
        return await PluginDetails.find();
    }
    catch(err){
        console.log(err)
    }
}
