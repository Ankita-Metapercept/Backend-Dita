<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
    exclude-result-prefixes="xs w wp a pic xlink"
    version="2.0">
    
    <xsl:output standalone="no" doctype-public="-//OASIS//DTD DITA Map//EN" doctype-system="map.dtd" indent="yes"/>
    <xsl:param name="file-uri" as="xs:string" select="base-uri(.)"/>
    <xsl:variable name="book_name" select="topics/title"/>
    <xsl:variable name="topic_id_1" select="topics/replace(title, ' ', '_')"/>
    
    
    <xsl:template match="topics">
        <xsl:variable name="topic_id" select="replace(title, ' ', '_')"/>
        <xsl:result-document href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$topic_id_1}.ditamap" method="xml">
            <map>
                <title><xsl:value-of select="$book_name"/></title>
            <xsl:for-each select="topic">
                <topicref href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$topic_id_1}/{lower-case(replace(replace(title, ' ', '_'), '\.', '_'))}/{lower-case(replace(replace(title, ' ', '_'), '\.', '_'))}.ditamap" navtitle="{title}" format="ditamap">
                </topicref>
            </xsl:for-each>
            </map>
        </xsl:result-document>
                
        <xsl:for-each select="topic">
            
            <xsl:variable name="subsection" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
            
            <xsl:result-document href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$topic_id}/{$subsection}/{$subsection}.ditamap" method="xml">
            <map>
                <title><xsl:value-of select="replace($subsection, '_', ' ')"/></title>
                <topicref href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$subsection}.dita" navtitle="{title}">
                </topicref>
            
                <xsl:for-each select="topic">
                    <xsl:variable name="subsection2" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
                    <topicref href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$subsection2}/{$subsection2}.dita" navtitle="{title}">
                        <xsl:for-each select="topic">
                            <xsl:variable name="subsection3" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
                            <topicref href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$subsection2}/{$subsection3}.dita" navtitle="{title}">
                            </topicref>
                        </xsl:for-each>
                    </topicref>
                </xsl:for-each>
            </map>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
    
    
</xsl:stylesheet>
