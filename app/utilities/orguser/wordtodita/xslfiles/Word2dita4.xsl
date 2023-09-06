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
    
    <xsl:output indent="yes"/>
    <xsl:param name="file-uri" as="xs:string" select="base-uri(.)"/>
    
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:output method="xml" doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd" indent="yes"/>
    
    <xsl:variable name="topic_id" select="topics/title"/>
    
    <xsl:template match="topics[@id]">
        
        <xsl:variable name="Topic_Folder" select="replace(title, ' ', '_')"/>
        
        <xsl:for-each select="topic[@id]">
            <xsl:variable name="first_level_topic_id" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
            <xsl:result-document
                href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$Topic_Folder}/{$first_level_topic_id}/{lower-case(replace(replace(title, ' ', '_'), '\.', '_'))}.dita">
                <xsl:copy copy-namespaces="no">
                    <xsl:apply-templates select="@*, node() except (topic[@id])"/>
                </xsl:copy>
            </xsl:result-document>
            
            <xsl:for-each select="topic[@id]">
                <xsl:variable name="second_topic_level" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
                <xsl:result-document
                    href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$Topic_Folder}/{$first_level_topic_id}/{$second_topic_level}/{lower-case(replace(replace(title, ' ', '_'), '\.', '_'))}.dita">
                    <xsl:copy copy-namespaces="no">
                        <xsl:apply-templates select="@*, node() except (topic[@id])"/>
                    </xsl:copy>
                </xsl:result-document>
                
                <xsl:for-each select="topic[@id]">
                    <xsl:variable name="third_topic_level" select="lower-case(replace(replace(title, ' ', '_'), '\.', '_'))"/>
                    <xsl:result-document
                        href="{substring-before($file-uri, '/extracted-files')}/DitaFiles/{$Topic_Folder}/{$first_level_topic_id}/{$second_topic_level}/{lower-case(replace(replace(title, ' ', '_'), '\.', '_'))}.dita">
                        <xsl:copy copy-namespaces="no">
                            <xsl:apply-templates select="@*, node() except (topic[@id])"/>
                        </xsl:copy>
                    </xsl:result-document>
                </xsl:for-each>
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
