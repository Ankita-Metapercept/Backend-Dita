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


    <xsl:output method="xml" indent="yes" use-character-maps="isolat1"/>
    <xsl:param name="file-uri" as="xs:string" select="base-uri(.)"/>
    <xsl:param name="core-meta" as="xs:string"
        select="doc(concat(substring-before($file-uri, '/word'), '/docProps/core.xml'))"/>
    <xsl:param name="txt-name" as="xs:string"
        select="doc(concat(substring-before($file-uri, '/word'), '/docProps/core.xml'))/*:coreProperties/*:title"/>
    <xsl:variable name="comments-file" select="
            if (doc-available(concat(substring-before($file-uri, '/word'), '/word/comments.xml'))) then
                doc(concat(substring-before($file-uri, '/word'), '/word/comments.xml'))
            else
                ()"/>
    <xsl:param name="change-width"/>

    <!-- ========================================================================== -->
    <!--          ENTITES MAPPING LIST                                              -->
    <!-- ========================================================================== -->
    <xsl:character-map name="isolat1">
        <xsl:output-character character="&#x2019;" string="&amp;#x2019;"/>
        <xsl:output-character character="&#x201c;" string="&amp;#x201c;"/>
        <xsl:output-character character="&#x201d;" string="&amp;#x201d;"/>
        <xsl:output-character character="&#x00a7;" string="&amp;#x00a7;"/>
        <xsl:output-character character="&#x2003;" string="&amp;#x2003;"/>
        <xsl:output-character character="&#x2013;" string="&amp;#x2013;"/>
        <xsl:output-character character="&#x2018;" string="&amp;#x2018;"/>
        <xsl:output-character character="&#x2014;" string="&amp;#x2014;"/>
        <xsl:output-character character="&#x2212;" string="&amp;#x2212;"/>
        <xsl:output-character character="&#x0026;" string="&amp;#x0026;"/>
        <xsl:output-character character="&#x25A0;" string="&amp;#x25A0;"/>
        <xsl:output-character character="&#x261B;" string="&amp;#x261B;"/>
        <xsl:output-character character="&lt;" string="&amp;lt;"/>
        <xsl:output-character character="&gt;" string="&amp;gt;"/>
        <xsl:output-character character="&apos;" string="&amp;apos;"/>
        <xsl:output-character character="&#x27A4;" string="&amp;#x27A4;"/>
        <xsl:output-character character="&#xa0;" string="&amp;#xa0;"/>
        <xsl:output-character character="&#xe0;" string="&amp;#xe0;"/>
        <xsl:output-character character="&#xb6;" string="&amp;#xb6;"/>
        <xsl:output-character character="&#x2026;" string="&amp;#x2026;"/>
        <xsl:output-character character="&#xbd;" string="&amp;#xbd;"/>
        <xsl:output-character character="&#xbd;" string="&amp;#xbd;"/>
        <xsl:output-character character="&#x2022;" string="&amp;#x2022;"/>
        <xsl:output-character character="&#x2002;" string="&amp;#x2002;"/>
        <xsl:output-character character="&#x25BA;" string="&amp;#x25BA;"/>
        <xsl:output-character character="&#x200A;" string="&amp;#x200A;"/>
        <xsl:output-character character="&#x0192;" string="&amp;#x0192;"/>
        <xsl:output-character character="&#xa9;" string="&amp;#xa9;"/>
        <!-- Non-Breaking Space Entity -->
        <xsl:output-character character="&#x00A0;" string="&amp;#x00A0;"/>
    </xsl:character-map>

    <xsl:template match="/">

        <topics id="{generate-id()}">
            <xsl:for-each select="w:document/w:body/w:p | w:document/w:body/w:tbl">
                <xsl:if test="local-name(.) = 'p'">
                    <xsl:choose>
                        <xsl:when test="w:pPr/w:pStyle/@w:val[. = 'Title']">
                            <title>
                                <xsl:attribute name="type">
                                    <xsl:choose>
                                        <xsl:when test="w:pPr/w:pStyle/@w:val = 'Title'">
                                            <xsl:value-of select="'Title'"/>
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:attribute>
                                <xsl:for-each select="w:r">
                                    <xsl:choose>
                                        <xsl:when test="w:t = ' '">
                                            <xsl:text disable-output-escaping="no">&#x00A0;</xsl:text>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:apply-templates select="w:t"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </title>
                        </xsl:when>
                    </xsl:choose>

                    <xsl:if test="w:pPr[w:pStyle[contains(@w:val, 'Heading1')]]">
                        <topic lavel="{replace((w:pPr/w:pStyle/@w:val),'Heading','')}">
                            <title>
                                <xsl:for-each select="w:r">
                                    <xsl:choose>
                                        <xsl:when test="w:rPr/w:b">
                                            <b>
                                                <xsl:apply-templates select="w:t"/>
                                            </b>
                                        </xsl:when>
                                        <xsl:when test="w:rPr/w:i">
                                            <i>
                                                <xsl:apply-templates select="w:t"/>
                                            </i>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:apply-templates select="w:t"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </title>
                        </topic>
                    </xsl:if>

                    <xsl:if test="w:pPr[w:pStyle[contains(@w:val, 'Heading2')]]">
                        <topic lavel="{replace((w:pPr/w:pStyle/@w:val),'Heading','')}">
                            <title>
                                <xsl:for-each select="w:r">
                                    <xsl:choose>
                                        <xsl:when test="w:rPr/w:b">
                                            <b>
                                                <xsl:apply-templates select="w:t"/>
                                            </b>
                                        </xsl:when>
                                        <xsl:when test="w:rPr/w:i">
                                            <i>
                                                <xsl:apply-templates select="w:t"/>
                                            </i>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:apply-templates select="w:t"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </title>
                        </topic>
                    </xsl:if>

                    <xsl:if test="w:pPr[w:pStyle[contains(@w:val, 'Heading3')]]">
                        <topic lavel="{replace((w:pPr/w:pStyle/@w:val),'Heading','')}">
                            <title>
                                <xsl:for-each select="w:r">
                                    <xsl:choose>
                                        <xsl:when test="w:rPr/w:b">
                                            <b>
                                                <xsl:apply-templates select="w:t"/>
                                            </b>
                                        </xsl:when>
                                        <xsl:when test="w:rPr/w:i">
                                            <i>
                                                <xsl:apply-templates select="w:t"/>
                                            </i>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:apply-templates select="w:t"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </title>
                        </topic>
                    </xsl:if>
                    
                    <xsl:if test="w:pPr[w:pStyle[@w:val='Para']]">
                        <p content-type="{(w:pPr/w:pStyle/@w:val)}">
                            <xsl:if test="w:bookmarkStart[parent::w:p]">
                                <xsl:attribute name="id">
                                    <xsl:value-of select="w:bookmarkStart/@w:name"/>
                                </xsl:attribute>
                            </xsl:if>
                            <xsl:for-each select="w:r | w:hyperlink/w:r">
                                <xsl:choose>
                                    <xsl:when test="w:rPr/w:b and not(w:rPr/w:i)">
                                        <b>
                                            <xsl:apply-templates select="w:t"/>
                                        </b>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:i and not(w:rPr/w:b)">
                                        <i>
                                            <xsl:apply-templates select="w:t"/>
                                        </i>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:u">
                                        <u>
                                            <xsl:apply-templates select="w:t"/>
                                        </u>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:b and w:rPr/w:i">
                                        <b>
                                            <i>
                                            <xsl:apply-templates select="w:t"/>
                                            </i>
                                        </b>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@w:anchor">
                                        <xref href="{ancestor::w:hyperlink/@w:anchor}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </xref>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@r:id">
                                        <a href="{ancestor::w:hyperlink/w:r/w:t}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </a>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:apply-templates select="w:t"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:for-each>
                        </p>
                    </xsl:if>
                    
                    <xsl:if test="not(w:pPr[w:pStyle[@w:val]])">
                        <p content-type="Para">
                            <xsl:if test="w:bookmarkStart[parent::w:p]">
                                <xsl:attribute name="id">
                                    <xsl:value-of select="w:bookmarkStart/@w:name"/>
                                </xsl:attribute>
                            </xsl:if>
                            <xsl:for-each select="w:r | w:hyperlink/w:r">
                                <xsl:choose>
                                    <xsl:when test="w:rPr/w:b">
                                        <b>
                                            <xsl:apply-templates select="w:t"/>
                                        </b>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:i">
                                        <i>
                                            <xsl:apply-templates select="w:t"/>
                                        </i>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:u">
                                        <u>
                                            <xsl:apply-templates select="w:t"/>
                                        </u>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@w:anchor">
                                        <xref href="{ancestor::w:hyperlink/@w:anchor}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </xref>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@r:id">
                                        <a href="{ancestor::w:hyperlink/w:r/w:t}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </a>
                                    </xsl:when>
                                    <xsl:when test="w:instrText">
                                            <xsl:analyze-string select="." regex=" HYPERLINK &#34;(.*?)&#34;">
                                                <xsl:matching-substring>
                                                    <a href="{regex-group(1)}">
                                                    <xsl:value-of select="regex-group(1)"/>
                                                    </a>
                                                </xsl:matching-substring>
                                                <xsl:non-matching-substring>
                                                    <xsl:value-of select="."/>
                                                </xsl:non-matching-substring>
                                            </xsl:analyze-string>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:apply-templates select="w:t"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:for-each>
                        </p>
                    </xsl:if>
                    
                    
                    <xsl:if test="w:pPr[w:pStyle[@w:val='Note']]">
                        <note>
                            <p>
                                <xsl:for-each select="w:r | w:hyperlink/w:r">
                                <xsl:choose>
                                    <xsl:when test="w:rPr/w:b">
                                        <b>
                                            <xsl:apply-templates select="w:t"/>
                                        </b>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:i">
                                        <i>
                                            <xsl:apply-templates select="w:t"/>
                                        </i>
                                    </xsl:when>
                                    <xsl:when test="w:rPr/w:u">
                                        <u>
                                            <xsl:apply-templates select="w:t"/>
                                        </u>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@w:anchor">
                                        <xref href="{ancestor::w:hyperlink/@w:anchor}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </xref>
                                    </xsl:when>
                                    <xsl:when test="parent::w:hyperlink/@r:id">
                                        <a href="{ancestor::w:hyperlink/w:r/w:t}">
                                            <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                        </a>
                                    </xsl:when>
                                    <xsl:when test="w:instrText">
                                        <xsl:analyze-string select="." regex=" HYPERLINK &#34;(.*?)&#34;">
                                            <xsl:matching-substring>
                                                <a href="{regex-group(1)}">
                                                    <xsl:value-of select="regex-group(1)"/>
                                                </a>
                                            </xsl:matching-substring>
                                            <xsl:non-matching-substring>
                                                <xsl:value-of select="."/>
                                            </xsl:non-matching-substring>
                                        </xsl:analyze-string>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:apply-templates select="w:t"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:for-each>
                            </p>
                        </note>
                    </xsl:if>
                    

                    <xsl:if test="w:pPr[w:pStyle[contains(@w:val, 'ListParagraph')]]">
                        <li type="{w:pPr/w:pStyle/@w:val}">
                            <!--<p>-->
                            <xsl:for-each select="w:r | w:hyperlink/w:r">
                                    <xsl:choose>
                                        <xsl:when test="w:rPr/w:i">
                                            <i>
                                                <xsl:value-of select="w:t"/>
                                            </i>
                                        </xsl:when>
                                        <xsl:when test="w:rPr/w:b">
                                            <b>
                                                <xsl:apply-templates select="w:t"/>
                                            </b>
                                        </xsl:when>
                                        <xsl:when test="w:rPr/w:u">
                                            <u>
                                                <xsl:apply-templates select="w:t"/>
                                            </u>
                                        </xsl:when>
                                        <xsl:when test="parent::w:hyperlink/@w:anchor">
                                            <xref href="{ancestor::w:hyperlink/@w:anchor}">
                                                <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                            </xref>
                                        </xsl:when>
                                        <xsl:when test="parent::w:hyperlink/@r:id">
                                            <a href="{ancestor::w:hyperlink/w:r/w:t}">
                                                <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                            </a>
                                        </xsl:when>
                                        <xsl:when test="w:instrText">
                                            <xsl:analyze-string select="." regex=" HYPERLINK &#34;(.*?)&#34;">
                                                <xsl:matching-substring>
                                                    <a href="{regex-group(1)}">
                                                        <xsl:value-of select="regex-group(1)"/>
                                                    </a>
                                                </xsl:matching-substring>
                                                <xsl:non-matching-substring>
                                                    <xsl:value-of select="."/>
                                                </xsl:non-matching-substring>
                                            </xsl:analyze-string>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:apply-templates select="w:t"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            <!--</p>-->
                        </li>
                    </xsl:if>
                </xsl:if>
                
                
                <!--Image-->
                <xsl:if test="w:r/w:drawing/wp:inline">
                    <xsl:if test="w:r/w:drawing/wp:inline">
                        <xsl:for-each select="w:r/w:drawing/wp:inline/a:graphic/a:graphicData/pic:pic/pic:nvPicPr/pic:cNvPr/@name">
                                <image>
                                    <xsl:attribute name="href" select="concat('../../media/',.)"/>
                                </image>
                        </xsl:for-each>
                    </xsl:if>
                </xsl:if>
                <!--Image-->
                
                
                <!--Table handling-->
                <xsl:if test="local-name(.)='tbl'">
                    <table>
                        <xsl:variable name="table-attributes" select="w:tblPr/w:tblStyle/@w:val"/>
                        <xsl:variable name="c-count" select="count(w:tblGrid/w:gridCol)"/>
                        <xsl:variable name="r-count" select="count(w:tr)"/>
                        <xsl:variable name="orientation">
                            <xsl:choose>
                                <xsl:when test="starts-with($table-attributes,'portrait')">
                                    <xsl:value-of select="'portrait'"/>
                                </xsl:when>
                                <xsl:when test="starts-with($table-attributes,'landscape')">
                                    <xsl:value-of select="'landscape'"/>
                                </xsl:when>
                            </xsl:choose>
                        </xsl:variable>
                        <xsl:if test="normalize-space($orientation)">
                            <xsl:attribute name="orientation" select="$orientation"/>
                        </xsl:if>
                        <xsl:variable name="table-style">
                            <xsl:choose>
                                <xsl:when test="contains($table-attributes,'reg8')">
                                    <xsl:value-of select="'reg8'"/>
                                </xsl:when>
                            </xsl:choose>
                        </xsl:variable>
                        <xsl:variable name="table-border">
                            <xsl:choose>
                                <xsl:when test="ends-with($table-attributes,'none')">
                                    <xsl:value-of select="'none'"/>
                                </xsl:when>
                                <xsl:when test="ends-with($table-attributes,'all')">
                                    <xsl:value-of select="'all'"/>
                                </xsl:when>
                                <xsl:when test="ends-with($table-attributes,'top')">
                                    <xsl:value-of select="'top'"/>
                                </xsl:when>
                            </xsl:choose>
                        </xsl:variable>
                        
                            <xsl:if test="normalize-space($table-style)">
                                <xsl:attribute name="style" select="$table-style"/>
                            </xsl:if>
                            <xsl:if test="normalize-space($table-border)">
                                <xsl:attribute name="border" select="$table-border"/>
                            </xsl:if>
                            <xsl:attribute name="frame">
                                <xsl:value-of select="'all'"/>
                            </xsl:attribute>
                            <xsl:if test="w:tblGrid">
                                <tgroup>
                                    <xsl:for-each select="w:tblGrid/w:gridCol">
                                        <colspec colname="{concat('col',position())}" colwidth="{concat((@w:w div 100),'%')}"/>
                                    </xsl:for-each>
                                    <tbody>
                                        <xsl:for-each select="w:tr">
                                            <xsl:choose>
                                                <xsl:when test="not(w:trPr/w:tblHeader)">
                                                    <row>
                                                        <xsl:for-each select="w:tc">
                                                            <xsl:if test="not(w:tcPr/w:vMerge[not(@*)])">
                                                                <entry>
                                                                    <xsl:if test="w:tcPr/w:gridSpan/@w:val">
                                                                        <xsl:attribute name="namest">
                                                                            <xsl:value-of select="concat('c',position())"/>
                                                                        </xsl:attribute>
                                                                        <xsl:attribute name="nammend">
                                                                            <xsl:value-of select="concat('c',w:tcPr/w:gridSpan/@w:val)"/>
                                                                        </xsl:attribute>
                                                                    </xsl:if>
                                                                    
                                                                    <xsl:for-each select="w:p">
                                                                        <p>
                                                                            <xsl:for-each select="w:r | w:hyperlink/w:r">
                                                                        <xsl:choose>
                                                                            <xsl:when test="w:rPr/w:b">
                                                                                <b><xsl:value-of select="w:t"/></b>
                                                                            </xsl:when>
                                                                            <xsl:when test="w:rPr/w:i">
                                                                                <i><xsl:value-of select="w:t"/></i>
                                                                            </xsl:when>
                                                                            <xsl:when test="w:rPr/w:u">
                                                                                <u><xsl:value-of select="w:t"/></u>
                                                                            </xsl:when>
                                                                            <xsl:when test="w:instrText">
                                                                                <xsl:analyze-string select="." regex=" HYPERLINK &#34;(.*?)&#34;">
                                                                                    <xsl:matching-substring>
                                                                                        <a href="{regex-group(1)}">
                                                                                            <xsl:value-of select="regex-group(1)"/>
                                                                                        </a>
                                                                                    </xsl:matching-substring>
                                                                                    <xsl:non-matching-substring>
                                                                                        <xsl:value-of select="."/>
                                                                                    </xsl:non-matching-substring>
                                                                                </xsl:analyze-string>
                                                                            </xsl:when>
                                                                            
                                                                            <xsl:when test="parent::w:hyperlink/@w:anchor">
                                                                                <xref href="{ancestor::w:hyperlink/@w:anchor}">
                                                                                    <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                                                                </xref>
                                                                            </xsl:when>
                                                                            <xsl:when test="parent::w:hyperlink/@r:id">
                                                                                <a href="{ancestor::w:hyperlink/w:r/w:t}">
                                                                                    <xsl:apply-templates select="ancestor::w:hyperlink/w:r/w:t"/>
                                                                                </a>
                                                                            </xsl:when>
                                                                            <xsl:otherwise>
                                                                                <xsl:value-of select="w:t"/>
                                                                            </xsl:otherwise>
                                                                        </xsl:choose>
                                                                        </xsl:for-each>
                                                                        </p>
                                                                    </xsl:for-each>
                                                                </entry>
                                                            </xsl:if>
                                                        </xsl:for-each>
                                                    </row>
                                                </xsl:when>
                                            </xsl:choose>
                                        </xsl:for-each>
                                    </tbody>
                                </tgroup>
                            </xsl:if>
                    </table>
                </xsl:if>
            </xsl:for-each>
            <!--/Table-->
        </topics>
    </xsl:template>
</xsl:stylesheet>

