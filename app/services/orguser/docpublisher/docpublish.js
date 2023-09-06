const shell = require('shelljs')
module.exports = {
    docPublish
};
// Output Generate and stored at local path
async function docPublish(publishParams) {
    try{
        shell.cd(publishParams.binPath)
        let systemType = shell.exec("if exist C:/ (echo Windows) else (echo Linux)",{silent:true}).stdout
        const command = "dita";
        const arg1 = `-i ${publishParams.inputPath}`;
        const arg2 = `-o ${publishParams.outputPath}`;
        const arg3 = `-f ${publishParams.outputFormat}`;
        const fullCommand = `${command} ${arg1} ${arg2} ${arg3}`;
        if(systemType.includes("Windows")){
            const result = shell.exec(fullCommand, { silent: false });
            if (result.code !== 0) {
                throw result.stderr || result.stdout;
            }
            return { message: "Output Generated successfully!" }
        }
        else{
            const combinedCommand = `export PATH="${publishParams.binPath}:$PATH" && ${fullCommand}`;        
            const result = shell.exec(combinedCommand, { silent: false });
            if (result.code !== 0) {
                throw result.stderr || result.stdout;
            }
        }
        return { message: "Output Generated successfully!" }
    }
    catch(error){
        throw error
    }
}