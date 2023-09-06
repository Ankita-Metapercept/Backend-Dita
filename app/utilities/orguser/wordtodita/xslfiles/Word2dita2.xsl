<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
    exclude-result-prefixes="xs w wp a pic xlink"
    version="2.0">
    
    
    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
    
    <!-- topic Nesting -->
    <xsl:template match="topics">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:for-each-group select="node()" group-starting-with="topic[@lavel='1']">
                <xsl:choose>
                    <xsl:when test="current-group()[1][self::topic[@lavel='1']]">
                        <xsl:element name="topic">
                            <xsl:attribute name="id" select="generate-id()"/>
                            <xsl:copy-of select="current-group()[1]/@*"/>
                            <xsl:call-template name="topicNesting">
                                <xsl:with-param name="node" select="current-group()[1]/*|current-group()[position()!=1]"/>
                                <xsl:with-param name="count" select="number(2)"/>
                            </xsl:call-template>
                        </xsl:element>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:apply-templates select="current-group()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each-group>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template name="topicNesting">
        <xsl:param name="node"/>
        <xsl:param name="count"/>
        <xsl:for-each-group select="$node" group-starting-with="topic[@lavel=$count]">
            <xsl:choose>
                <xsl:when test="current-group()[1][self::topic[@lavel=$count]]">
                    <xsl:element name="topic">
                        <xsl:attribute name="id" select="generate-id()"/>
                        <xsl:copy-of select="current-group()[1]/@*"/>
                        <xsl:call-template name="topicNesting">
                            <xsl:with-param name="node" select="current-group()[1]/*|current-group()[position()!=1]"/>
                            <xsl:with-param name="count" select="$count+1"/>
                        </xsl:call-template>
                    </xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="current-group()"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each-group>
    </xsl:template>
    <!-- topic Nesting -->
    

<!--List Nesting-->
    <xsl:template match="li [@type='ListParagraph']">
        <xsl:if test="not(preceding-sibling::*[1][self::li])">
            <xsl:text disable-output-escaping="yes"><![CDATA[<ul>]]></xsl:text>
        </xsl:if>
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
        <xsl:if test="not(following-sibling::*[1][self::li])">
            <xsl:text disable-output-escaping="yes"><![CDATA[</ul>]]></xsl:text>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="li [@type='ListNumber']">
        <xsl:if test="not(preceding-sibling::*[1][self::li])">
            <xsl:text disable-output-escaping="yes"><![CDATA[<ol>]]></xsl:text>
        </xsl:if>
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
        <xsl:if test="not(following-sibling::*[1][self::li])">
            <xsl:text disable-output-escaping="yes"><![CDATA[</ol>]]></xsl:text>
        </xsl:if>
    </xsl:template>
    <!--List Nesting-->
    
    
    <xsl:template match="tgroup">
        <tgroup>
            <xsl:attribute name="cols">
                <xsl:value-of select="count(colspec)"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </tgroup>
    </xsl:template>
    
    
</xsl:stylesheet>