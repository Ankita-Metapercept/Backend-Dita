const { v4: uuidv4 } = require("uuid");
const { schema } = require("./schema.js");

function addNewNode(nodeDetails, editDetails, flag) {
    if (typeof nodeDetails === "string") {
    return;
  }
  if (editDetails.nodeId === nodeDetails.nodeId) {
    flag = true;
    const tagName = nodeDetails.xtag;
    const addTagName = editDetails.xtag
    const sequence = schema[tagName].sequence;
    if (sequence.length) {
      // if sequence is assigned for given node in schema
      const uuid = uuidv4();
      const newNode = {
        nodeId: uuid,
        xtag: editDetails.xtag,
      };
      newNode[addTagName] = schema[addTagName].textContent
        ? [""]
        : [];
      newNode.childFrequency = {};
      nodeDetails.ancestors[tagName] = true;
      newNode.ancestors = { ...nodeDetails.ancestors };
      checkSequenceAndAdd(nodeDetails, editDetails, sequence);
    } else {
      // if sequence is not assigned for given node in schema
      const uuid = uuidv4();
      const newNode = {
        nodeId: uuid,
        xtag: addTagName,
      };
      newNode[addTagName] = schema[addTagName].textContent
        ? [""]
        : [];
      newNode.childFrequency = {};
      nodeDetails.ancestors[tagName] = true;
      newNode.ancestors = { ...nodeDetails.ancestors };
      // add child only if it's maximum occurance limit is not exeeded
      if (
        !nodeDetails.childFrequency[addTagName] ||
        nodeDetails.childFrequency[addTagName] <
          schema[tagName].validChild[addTagName].maxOcc ||
        schema[tagName].validChild[addTagName].maxOcc === "unbound"
      ) {
        nodeDetails[tagName].push(newNode);
        if (!nodeDetails.childFrequency[addTagName]) {
          nodeDetails.childFrequency[addTagName] = 1;
        } else {
          nodeDetails.childFrequency[addTagName]++;
        }
      }
    }
  }
  if (flag) return;
  const tagName = nodeDetails.xtag;
  if (!nodeDetails[tagName]) return;
  for (const childNode of nodeDetails[tagName]) {
    // recursive tracking of target node
    addNewNode(childNode, editDetails, flag);
  }
}

function addDitaContentImage(nodeDetails, editDetails, flag, imageHref) {
  if (typeof nodeDetails === "string") {
    return;
  }
  if (editDetails.nodeId === nodeDetails.nodeId) {
    flag = true;
    const tagName = nodeDetails.xtag;
    const addTagName = editDetails.xtag
    const sequence = schema[tagName].sequence;
    if (sequence.length) {
      // if sequence is assigned for given node in schema
      checkSequenceAndAdd(nodeDetails, editDetails, sequence, imageHref);
    } else {
      // if sequence is not assigned for given node in schema
      const uuid = uuidv4();
      const newNode = {
        nodeId: uuid,
        xtag: addTagName,
      };
      newNode[addTagName] = schema[addTagName].textContent
        ? [""]
        : [];
      newNode.childFrequency = {};
      nodeDetails.ancestors[tagName] = true;
      newNode.ancestors = { ...nodeDetails.ancestors };
      newNode.href = imageHref;
      // add child only if it's maximum occurance limit is not exeeded
      if (
        !nodeDetails.childFrequency[addTagName] ||
        nodeDetails.childFrequency[addTagName] <
          schema[tagName].validChild[addTagName].maxOcc ||
        schema[tagName].validChild[addTagName].maxOcc === "unbound"
      ) {
        nodeDetails[tagName].push(newNode);
        if (!nodeDetails.childFrequency[addTagName]) {
          nodeDetails.childFrequency[addTagName] = 1;
        } else {
          nodeDetails.childFrequency[addTagName]++;
        }
      }
    }
  }
  if (flag) return;
  const tagName = nodeDetails.xtag;
  if (!nodeDetails[tagName]) return;
  for (const childNode of nodeDetails[tagName]) {
    // recursive tracking of target node
    addDitaContentImage(childNode, editDetails, flag, imageHref);
  }
}

function checkSequenceAndAdd(nodeDetails, editDetails, sequence, imageHref) {
  const indxFinder = {
    preIndx: -1,
  };
  const addTagName = editDetails.xtag
  const tagName = nodeDetails.xtag
  const indxHashTable = {};
  let xtagIndx = -1;
  for (let i = 0; i < sequence.length; i++) {
    if (typeof sequence[i] === "string") {
      indxHashTable[sequence[i]] = i;
    } else {
      for (const key in sequence[i]) {
        indxHashTable[key] = i;
      }
      if (sequence[i][addTagName]) xtagIndx = i;
    }
    if (typeof sequence[i] === "string" && sequence[i] === addTagName) {
      xtagIndx = i;
    }
  }
  if (!nodeDetails[tagName]) {
    nodeDetails[tagName] = schema[tagName].textContent
      ? [""]
      : [];
  }
  for (let i = 0; i < nodeDetails[tagName].length; i++) {
    if (indxHashTable[nodeDetails[tagName][i].xtag] < xtagIndx) {
      indxFinder.preIndx = i;
    }
  }
  //   console.log(indxFinder, xtagIndx);
  const uuid = uuidv4();
  const newNode = {
    nodeId: uuid,
    xtag: addTagName,
  };
  newNode[addTagName] = schema[addTagName].textContent ? [""] : [];
  newNode.childFrequency = {};
  nodeDetails.ancestors[tagName] = true;
  newNode.ancestors = { ...nodeDetails.ancestors };
  if (imageHref) newNode.href = imageHref;
  // add child only if it's maximum occurance limit is not exeeded
  if (
    !nodeDetails.childFrequency[addTagName] ||
    nodeDetails.childFrequency[addTagName] <
      schema[tagName].validChild[addTagName].maxOcc ||
    schema[tagName].validChild[addTagName].maxOcc === "unbound"
  ) {
    nodeDetails[tagName].splice(indxFinder.preIndx + 1, 0, newNode);
    if (!nodeDetails.childFrequency[addTagName]) {
      nodeDetails.childFrequency[addTagName] = 1;
    } else {
      nodeDetails.childFrequency[addTagName]++;
    }
  }
}

module.exports = { addNewNode, addDitaContentImage };
