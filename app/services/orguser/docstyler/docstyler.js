const fs = require("fs")
const db = require("../../../config/db.js");
const { createCustomizedXslt } = require("../../../utilities/orguser/docstyler/createcustomizedxslt.js");
const {createCustomizedStylesheet} = require("../../../utilities/orguser/docstyler/createcustomizestylesheet.js")
const {orgUserWorkspace,organization} = db

module.exports={customizePdfOutput,uploadPdfLogo,customizeHtmlOutput,uploadHtmlLogo}

async function customizePdfOutput(params){
    try {
        const {userId,orgId,customizationOptions} = params
        const userWorkspaceDetails = await orgUserWorkspace.findOne({userId,orgId})
        const organizationDetails = await organization.findOne({_id:orgId})
        if(!organizationDetails) throw "No such user exists or invalid user details!"
        if(!orgUserWorkspace) throw "No workspace created yet or invalid user details!"
        const {ditaotVersion} = organizationDetails
        const {installedPath} = userWorkspaceDetails
        const ditaCustomAttributePath = installedPath + "/dita-ot-" + ditaotVersion + "/plugins/org.dita.pdf2/cfg/fo/attrs/custom.xsl"
        const ditaCustomApplytemplatePath = installedPath + "/dita-ot-" + ditaotVersion + "/plugins/org.dita.pdf2/cfg/fo/xsl/custom.xsl"
        const ditaCommonVariablePath = installedPath + "/dita-ot-" + ditaotVersion + "/plugins/org.dita.pdf2/cfg/common/vars/"
        const {customAttributesXslt,customApplytemplateXslt,customCommonVaribale,commonVariableFilename} = createCustomizedXslt(customizationOptions,ditaCommonVariablePath)
        // writting custom attributes xslt
        fs.writeFileSync(ditaCustomAttributePath,customAttributesXslt)
        //writting custom apply template xslt 
        fs.writeFileSync(ditaCustomApplytemplatePath,customApplytemplateXslt)
        // writing custom variables for adding custom bullet styles in ol and ul
        fs.writeFileSync(ditaCommonVariablePath+commonVariableFilename,customCommonVaribale)
        return {message:"customization complete!"}
    } catch (error) {
        throw error
    }
}
async function customizeHtmlOutput(params){
    try {
        const {userId,orgId,customizationOptions} = params
        const userWorkspaceDetails = await orgUserWorkspace.findOne({userId,orgId})
        const organizationDetails = await organization.findOne({_id:orgId})
        if(!organizationDetails) throw "No such user exists or invalid user details!"
        if(!orgUserWorkspace) throw "No workspace created yet or invalid user details!"
        const {ditaotVersion} = organizationDetails
        const {installedPath} = userWorkspaceDetails
        const ditaCustomStylsheetPath = installedPath + "/dita-ot-" + ditaotVersion +"/plugins/org.dita.html5/css/commonltr.css"
        const customStyleheet = createCustomizedStylesheet(customizationOptions,installedPath)
        // writting custom stylesheet
        fs.writeFileSync(ditaCustomStylsheetPath,customStyleheet)
        return {message:"customization complete!"}
    } catch (error) {
        throw error
    }
}
async function uploadPdfLogo(){
    return {message:"logo uploaded successfully!"}
}
async function uploadHtmlLogo(){
    return {message:"logo uploaded successfully!"}
}