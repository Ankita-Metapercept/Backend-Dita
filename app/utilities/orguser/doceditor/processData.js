const { v4: uuidv4 } = require("uuid");
const { schema } = require("./schema.js");

function processData(nodeDetails,ancestors) {
  if(typeof nodeDetails === "string" ){
    return
  }
  const uuid = uuidv4();
  nodeDetails.nodeId = uuid;
  nodeDetails.childFrequency = {};
  if(!nodeDetails.ancestors && ancestors){
    const obj = {}
    obj[nodeDetails.xtag]=true
    nodeDetails.ancestors={...obj,...ancestors}
  }else{
    nodeDetails.ancestors = {}
    nodeDetails.ancestors[nodeDetails.xtag]=true
  }
  const tagName = nodeDetails.xtag;
  if(!schema[tagName]){
    throw "The file you have chosen is either using a custom dtd or not valid as per DITA language specification !"
  }
  if(!nodeDetails[tagName]) {
    nodeDetails[tagName]= schema[tagName].textContent? [""]:[]
  }
  for (const childNode of nodeDetails[tagName]) {
    if (!nodeDetails.childFrequency[childNode.xtag] && childNode) {
      nodeDetails.childFrequency[childNode.xtag] = 1;
    }else{
        nodeDetails.childFrequency[childNode.xtag]++
    }
    processData(childNode,nodeDetails.ancestors);
  }
  return nodeDetails;
}
module.exports = { processData };
