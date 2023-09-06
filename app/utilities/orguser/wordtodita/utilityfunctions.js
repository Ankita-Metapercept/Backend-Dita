const fs = require("fs");
const path = require("path");

// function for getting the list of paths of ditamap files
const findDitamapPathsRecursively = function (baseDirPath, paths) {
  fs.readdirSync(baseDirPath, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) {
      findDitamapPathsRecursively(`${baseDirPath}/${dirent.name}`, paths);
    } else if (dirent.isFile() && dirent.name.split(".").pop() === "ditamap") {
      paths.push(`${baseDirPath}/${dirent.name}`);
    }
  });
  return paths;
};
// function for changing href path in ditamap file
const migrateToRelativePath = function (pathList) {
  for (let path of pathList) {
    const initialContent = fs.readFileSync(path, { encoding: "utf-8" });
    let regex = /href="(.*\/DitaFiles\/)(.*)"/;
    const match = initialContent.match(regex);
    regex = new RegExp(match[1], "g");
    const finalContent = initialContent.replace(regex, "");
    fs.writeFileSync(path, finalContent);
  }
};
function addFilesToZip(zip, folderPath,basePath) {
  fs.readdirSync(folderPath).forEach(function (file) {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      addFilesToZip(zip, filePath,basePath);
    } else {
      zip.file(
        path.relative(basePath, filePath),
        fs.readFileSync(filePath)
      );
    }
  });
}

module.exports = { findDitamapPathsRecursively, migrateToRelativePath,addFilesToZip };
