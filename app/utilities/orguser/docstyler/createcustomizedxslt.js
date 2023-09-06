const fs = require("fs")

exports.createCustomizedXslt = function(customizationOptions,ditaCommonVariablePath){
    const customAttributesXslt = `<?xml version='1.0'?>

    <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:fo="http://www.w3.org/1999/XSL/Format"
        version="2.0">
    
    <!-- frontmatter cutomization  -->
        <xsl:attribute-set name="__frontmatter__title" use-attribute-sets="common.title">
            <xsl:attribute name="space-before">${customizationOptions.frontmatter_title?.spacebefore||"80mm"}</xsl:attribute>
            <xsl:attribute name="font-size">${customizationOptions.frontmatter_title?.fontSize||"22pt"}</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.frontmatter_title?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="line-height">${customizationOptions.frontmatter_title?.lineHeight||"140%"}</xsl:attribute>
            <xsl:attribute name="text-align">${customizationOptions.frontmatter_title?.selectedAlignment||"center"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.frontmatter_title?.color||"black"}</xsl:attribute>
            <xsl:attribute name="letter-spacing">${customizationOptions.frontmatter_title?.letterSpacing||"0pt"}</xsl:attribute>
            <xsl:attribute name="font-family">${customizationOptions.frontmatter_title?.fontFamily||"Helvetica"}</xsl:attribute>
        </xsl:attribute-set>
    
        <xsl:attribute-set name="__frontmatter__subtitle" use-attribute-sets="common.title">
            <xsl:attribute name="font-size">${customizationOptions.frontmatter_subtitle?.fontSize||"18pt"}</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.frontmatter_subtitle?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="text-align">${customizationOptions.frontmatter_subtitle?.selectedAlignment||"center"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.frontmatter_subtitle?.color||"black"}</xsl:attribute>
            <xsl:attribute name="font-family">${customizationOptions.frontmatter_title?.fontFamily||"Helvetica"}</xsl:attribute>
        </xsl:attribute-set>
    
    <!-- header/footer cutomization  -->
        <xsl:attribute-set name="odd__header">
        <xsl:attribute name="text-align">${customizationOptions.static_content_oddheader?.selectedAlignment||"end"}</xsl:attribute>
        <xsl:attribute name="space-before">${customizationOptions.static_content_oddheader?.spacebefore||"10pt"}</xsl:attribute>
        <xsl:attribute name="color">${customizationOptions.static_content_oddheader?.color||"black"}</xsl:attribute>
      </xsl:attribute-set>
    
      <xsl:attribute-set name="even__header">
        <xsl:attribute name="start-indent">10pt</xsl:attribute>
        <xsl:attribute name="space-before">${customizationOptions.static_content_evenheader?.spacebefore||"10pt"}</xsl:attribute>
        <xsl:attribute name="color">${customizationOptions.static_content_evenheader?.color||"black"}</xsl:attribute>
      </xsl:attribute-set>
    
      <xsl:attribute-set name="odd__footer">
        <xsl:attribute name="text-align">end</xsl:attribute>
        <xsl:attribute name="space-after">${customizationOptions.static_content_oddfooter?.spaceafter||"10pt"}</xsl:attribute>
        <xsl:attribute name="color">${customizationOptions.static_content_oddfooter?.color||"black"}</xsl:attribute>
      </xsl:attribute-set>
    
      <xsl:attribute-set name="even__footer">
        <xsl:attribute name="start-indent">10pt</xsl:attribute>
        <xsl:attribute name="space-after">${customizationOptions.static_content_evenfooter?.spaceafter||"10pt"}</xsl:attribute>
        <xsl:attribute name="color">${customizationOptions.static_content_evenfooter?.color||"black"}</xsl:attribute>
      </xsl:attribute-set>
      
      <xsl:attribute-set name="pagenum">
        <xsl:attribute name="font-weight">${customizationOptions.static_content_pagenum?.fontWeight||"bold"}</xsl:attribute>
        <xsl:attribute name="font-family">${customizationOptions.static_content_pagenum?.fontFamily||"Helvetica"}</xsl:attribute>
        <xsl:attribute name="color">${customizationOptions.static_content_pagenum?.color||"black"}</xsl:attribute>
      </xsl:attribute-set>
    
      <!-- TOC cutomization  -->
        <xsl:attribute-set name="__toc__header" use-attribute-sets="common.title">
        <xsl:attribute name="font-family">${customizationOptions.toc_header?.fontFamily||"Helvetica"}</xsl:attribute>
            <xsl:attribute name="space-before">${customizationOptions.toc_header?.spacebefore||"0pt"}</xsl:attribute>
            <xsl:attribute name="space-after">${customizationOptions.toc_header?.spaceafter||"16.8pt"}</xsl:attribute>
            <xsl:attribute name="font-size">${customizationOptions.toc_header?.fontSize||"20pt"}</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.toc_header?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.toc_header?.color||"black"}</xsl:attribute>
        </xsl:attribute-set>
    
        <xsl:attribute-set name="__toc__chapter__content" use-attribute-sets="__toc__topic__content">
            <xsl:attribute name="font-size">${customizationOptions.toc_chap_content?.fontSize||"14pt"}</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.toc_chap_content?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.toc_chap_content?.color||"black"}</xsl:attribute>
        </xsl:attribute-set>
    
        <xsl:attribute-set name="__toc__leader">
            <xsl:attribute name="leader-pattern">${customizationOptions.toc_leader?.leader||"dots"}</xsl:attribute>
        </xsl:attribute-set>
    
    <!-- tables cutomization  -->
        <xsl:attribute-set name="table.title" use-attribute-sets="base-font common.title">
            <xsl:attribute name="font-weight">${customizationOptions.table_title?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.table_title?.color||"black"}</xsl:attribute>
            <xsl:attribute name="font-family">${customizationOptions.table_title?.fontFamily||"Helvetica"}</xsl:attribute>
            <xsl:attribute name="font-size">${customizationOptions.table_title?.fontSize||"12pt"}</xsl:attribute>
        </xsl:attribute-set>
    
        <xsl:attribute-set name="common.table.head.entry">
            <xsl:attribute name="font-weight">${customizationOptions.table_header?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="font-family">${customizationOptions.table_header?.fontFamily||"Helvetica"}</xsl:attribute>
            <xsl:attribute name="background-color">${customizationOptions.table_header?.background_color||"white"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.table_header?.color||"black"}</xsl:attribute>
        </xsl:attribute-set>
    
    <!-- List cutomization  -->
        <xsl:attribute-set name="ul.li">
            <xsl:attribute name="space-after">${customizationOptions.List_ul?.spaceafter||"1.5pt"}</xsl:attribute>
            <xsl:attribute name="space-before">${customizationOptions.List_ul?.spacebefore||"1.5pt"}</xsl:attribute>
            <xsl:attribute name="relative-align">baseline</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.List_ul?.spacefontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.List_ul?.color||"black"}</xsl:attribute>
        </xsl:attribute-set>
        
    
        <xsl:attribute-set name="ol.li">
            <xsl:attribute name="space-after">${customizationOptions.List_ol?.spaceafter||"1.5pt"}</xsl:attribute>
            <xsl:attribute name="space-before">${customizationOptions.List_ol?.spacebefore||"1.5pt"}</xsl:attribute>
            <xsl:attribute name="relative-align">baseline</xsl:attribute>
            <xsl:attribute name="font-weight">${customizationOptions.List_ol?.fontWeight||"bold"}</xsl:attribute>
            <xsl:attribute name="color">${customizationOptions.List_ol?.color||"black"}</xsl:attribute>
        </xsl:attribute-set>

        <!-- Cover/logo image -->
        <xsl:attribute-set name='__frontmatter__logo'>
		    <xsl:attribute name='padding-top'>5px</xsl:attribute>
		    <xsl:attribute name='width'>${customizationOptions.frontmatter_logo?.width||"100px"}</xsl:attribute>
		    <xsl:attribute name='content-width'>150px</xsl:attribute>
		    <xsl:attribute name='scaling'>uniform</xsl:attribute>
        </xsl:attribute-set>

        <xsl:attribute-set name='__frontmatter__logo__container'>
		    <xsl:attribute name='text-align'>${customizationOptions.frontmatter_logo?.selectedAlignment||"center"}</xsl:attribute>
		    <xsl:attribute name="content-width">scale-to-fit</xsl:attribute>
        </xsl:attribute-set>
        
    </xsl:stylesheet>`

    const customApplytemplateXslt = `<?xml version='1.0'?>

    <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format"
        version="2.0">
    
        <xsl:template name="createFrontCoverContents">
            <!-- frontmatter logo -->
            <fo:block-container xsl:use-attribute-sets='__frontmatter__logo__container'>
                <fo:block>
                    <fo:external-graphic src=${'"'+"Configuration/OpenTopic/cfg/common/artwork/"+customizationOptions.frontmatter_logo?.FrontmatterLogoFile+'"'}
                        xsl:use-attribute-sets='__frontmatter__logo' />
                </fo:block>
            </fo:block-container>
            <!-- set the title -->
            <fo:block xsl:use-attribute-sets="__frontmatter__title">
    
                <xsl:choose>
                    <xsl:when test="$map/*[contains(@class,' topic/title ')][1]">
                        <xsl:apply-templates select="$map/*[contains(@class,' topic/title ')][1]" />
                    </xsl:when>
                    <xsl:when test="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]">
                        <xsl:apply-templates select="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]" />
                    </xsl:when>
                    <xsl:when test="//*[contains(@class, ' map/map ')]/@title">
                        <xsl:value-of select="//*[contains(@class, ' map/map ')]/@title" />
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of
                            select="/descendant::*[contains(@class, ' topic/topic ')][1]/*[contains(@class, ' topic/title ')]" />
                    </xsl:otherwise>
                </xsl:choose>
            </fo:block>
            <!-- set the subtitle -->
            <xsl:apply-templates select="$map//*[contains(@class,' bookmap/booktitlealt ')]" />
            <fo:block xsl:use-attribute-sets="__frontmatter__owner">
                <xsl:apply-templates select="$map//*[contains(@class,' bookmap/bookmeta ')]" />
            </fo:block>
        </xsl:template>
    
    </xsl:stylesheet>`
    const commonVariableFilename = fs.existsSync(`${ditaCommonVariablePath}commonvariables.xml`)?"commonvariables.xml":"en.xml"
    let customCommonVaribale = fs.readFileSync(ditaCommonVariablePath+commonVariableFilename,"utf-8")
    //determining rootnode of commonvariables file
    const rootNode = customCommonVaribale.includes("</vars>")?"</vars>":"</variables>"
        customCommonVaribale = customCommonVaribale.split(rootNode)
    //adding customized bullet variables
    customCommonVaribale = customCommonVaribale[0] +
                            `\n<variable id="Ordered List Format 1">${customizationOptions.List_ol?.bullets || "1"}</variable>
                            <variable id="Unordered List bullet">${customizationOptions.List_ul?.ul_bullets || "•"}</variable>
                            <variable id="Unordered List bullet 1">${customizationOptions.List_ul?.ul_bullets || "•"}</variable> 
                        ${rootNode}`
    return {customAttributesXslt,customApplytemplateXslt,customCommonVaribale,commonVariableFilename}
}