<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
    exclude-result-prefixes="xs w wp a pic xlink" version="2.0">
    
    <xsl:variable name="Heading1" select="'Heading1' or 'Heading2' or 'Heading3' or 'Heading4' or 'Heading5'"/>
    
    <xsl:template match="topic">
        <xsl:choose>
            <xsl:when test="@lavel='1' or @lavel='2' or @lavel='3' or @lavel='4' or @lavel='5' or @lavel='6' or @lavel='7' or @lavel='8' or @lavel='9'">
                <xsl:message select="'Please process your document.'"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:message terminate="yes" select="'Please do not process your document.'"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="topics[not(child::topic)]">
        <xsl:message terminate="yes" select="'Please do not process your document.'"/>
    </xsl:template>

</xsl:stylesheet>
