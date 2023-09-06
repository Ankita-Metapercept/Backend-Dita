<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
    exclude-result-prefixes="xs w wp a pic xlink r"
    version="2.0">
    
    <xsl:output indent="yes"/>
    
    <xsl:template match="@* | node()">
        <xsl:copy copy-namespaces="no">
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="topic">
        <topic>
            <xsl:attribute name="id" select="@id"/>
            <xsl:apply-templates select="title"/>
            <xsl:element name="body">
                <xsl:apply-templates select="p | table | image | note | ul | ol"/>
            </xsl:element>
            <xsl:apply-templates select="topic"/>
        </topic>
    </xsl:template>
    
    
    <xsl:template match="title">
        <title>
            <xsl:apply-templates/>
        </title>
    </xsl:template>
    
    <xsl:template match="p">
        <p>
            <xsl:if test="@content-type">
                <xsl:attribute name="outputclass" select="@content-type"/>
            </xsl:if>
            <xsl:if test="@id">
                <xsl:attribute name="id" select="@id"/>
            </xsl:if>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="li">
        <li>
            <xsl:apply-templates/>
        </li>
    </xsl:template>
    
    <xsl:template match="table">
        <table>
            <xsl:apply-templates/>
        </table>
    </xsl:template>
    
    
    <xsl:template match="a">
        <xsl:element name="xref">
            <xsl:choose>
                <xsl:when test="@href">
                    <xsl:attribute name="href" select="@href"/>
                    <xsl:attribute name="format" select="'html'"/>
                    <xsl:attribute name="scope" select="'external'"/>
                </xsl:when>
            </xsl:choose>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="xref">
        <xsl:element name="xref">
        <xsl:choose>
            <xsl:when test="@href">
                <xsl:attribute name="href">
                    <xsl:value-of select="concat('#',ancestor::topic/@id,'/')"/>
                    <xsl:value-of select="@href"/>
                </xsl:attribute>
                <xsl:attribute name="format" select="'dita'"/>
            </xsl:when>
        </xsl:choose>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="p[not(normalize-space())]"/>
    
</xsl:stylesheet>
