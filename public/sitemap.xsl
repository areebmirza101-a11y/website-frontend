<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap — Velmoras Creation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            padding: 32px;
            border: 1px solid #e2e8f0;
          }
          .header {
            border-bottom: 2px solid #BA9B74;
            padding-bottom: 20px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          h1 span {
            color: #BA9B74;
          }
          p.intro {
            color: #64748b;
            font-size: 14px;
            margin: 6px 0 0 0;
            line-height: 1.5;
          }
          .badge {
            background: #f1f5f9;
            color: #0f172a;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 10px;
          }
          th {
            background: #f8fafc;
            text-align: left;
            padding: 12px 14px;
            font-weight: 600;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #fafafa;
          }
          a {
            color: #0f172a;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            color: #BA9B74;
            text-decoration: underline;
          }
          .priority-tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 11px;
            background: #e0f2fe;
            color: #0369a1;
          }
          .freq-tag {
            color: #64748b;
            font-size: 12px;
            text-transform: capitalize;
          }
          .image-info {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #059669;
            font-size: 11px;
            font-weight: 600;
            background: #ecfdf5;
            padding: 2px 8px;
            border-radius: 6px;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Velmoras Creation <span>Sitemap</span></h1>
              <p class="intro">Official XML Sitemap for Google, Bing, Yahoo and search crawlers.</p>
            </div>
            <div class="badge">
              Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL Location</th>
                <th style="width: 15%;">Image SEO</th>
                <th style="width: 10%;">Priority</th>
                <th style="width: 10%;">Frequency</th>
                <th style="width: 10%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="image:image">
                        <span class="image-info">✓ HD Image</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span style="color: #cbd5e1;">—</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <span class="priority-tag">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td class="freq-tag">
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td style="color: #64748b; font-size: 12px;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Velmoras Creation — Premium Handmade Leather Jackets, Cosplay &amp; Superhero Outfits
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
