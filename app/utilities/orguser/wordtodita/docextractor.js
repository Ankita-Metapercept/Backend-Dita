const StreamZip = require("node-stream-zip");
const fs = require("fs");
const shell = require("shelljs");

module.exports = {
  open: function (filePath, destinationPath) {
    return new Promise(function (resolve, reject) {
      const zip = new StreamZip({
        file: filePath,
        storeEntries: true,
      });
      zip.on("ready", () => {
        const filesList = zip.entries();
        const filePathList = Object.keys(filesList);
        // extracting all xml files in docx
        for (let filePath of filePathList) {
          const chunks = [];
          let content = "";
          if(!filePath.includes(".")) continue
          //reading data as stream of chunks
          zip.stream(filePath, (err, stream) => {
            if (err) {
              return reject(err);
            }
            stream.on("data", function (chunk) {
              chunks.push(chunk);
            });
            stream.on("end", function () {
              content = Buffer.concat(chunks);
              /* DO NOT REMOVE THIS NEXT LINE OF CODE IT MIGHT PROVE IMPORTANT IN CASE ANY ERROR OCCURS
                // zip.close();
              */
              const baseDirectoriesName = filePath.split("/");
              baseDirectoriesName.pop();
              const baseDireactoyPaths = baseDirectoriesName.join("/");
              shell.mkdir("-p", destinationPath + "/" + baseDireactoyPaths);
              fs.writeFileSync(
                destinationPath + "/" + filePath,
                content
              );
            });
          });
        }
      });
      resolve("success");
    });
  },
};
