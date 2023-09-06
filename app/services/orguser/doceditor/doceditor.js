const { addNewNode,addDitaContentImage } = require("../../../utilities/orguser/doceditor/addnewnode");
const { processData } = require("../../../utilities/orguser/doceditor/processData")
const path = require("path")

module.exports={editXml,generateNodeId,uploadDitaContentImg}

async function editXml(params){
    try {
        const { nodeDetails, reqType, editDetails } = params;
        const {filePath,projectName,imgName} = editDetails
        switch (reqType) {
            case "addNewNode": {
              addNewNode(nodeDetails, editDetails,false)
              return nodeDetails
            }
            case "addDitaContentImage":{
                const projectRootFolder = filePath.split(projectName)
                const imageLocation = projectRootFolder[0]+projectName+`/images/${imgName}`
                const imageHref = path.relative(path.dirname(path.resolve(filePath)),imageLocation)
                addDitaContentImage(nodeDetails, editDetails,false,imageHref)
                return nodeDetails
            }
            default:
              return {};
        }
    } catch (error) {
        throw error
    }
}

async function generateNodeId(params){
    try {
        const {nodeDetails,ancestors} = params
        const processedData = processData(nodeDetails,ancestors)
        return processedData
    } catch (error) {
        throw error
    }
}
async function uploadDitaContentImg(){
    return {message:"image uploaded successfully!"}
}