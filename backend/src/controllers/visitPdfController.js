import puppeteer from 'puppeteer';
import { fetchVisitsForPdf } from '../models/visitPdfModel.js';

export const generateVisitPdf = async (req, res) => {
  try {
    const { isa_id, month, year, date, location_id } = req.query;

    if (!isa_id || !month || !year) {
      return res.status(400).json({
        error: 'isa_id, month, and year are required',
      });
    }

    const visits = await fetchVisitsForPdf({
      isa_id,
      month,
      year,
      date,
      location_id,
    });

    if (visits.length === 0) {
      return res.status(404).json({ error: 'No visits found' });
    }

    const isaName = visits[0].isa_name;

    /* ---------- HTML TEMPLATE ---------- */
    const html = `
      <html>
      <head>
        <style>
          body {
            font-family:sans-serif;
            font-size: 12px;
            margin: 20;
            padding: 0;
          }

          h1, h3 {
            text-align: center;
            margin: 0;
          }

          .meta-row {
            display: flex;
            justify-content: space-between; /* left-right alignment */
            margin: 6px 0;
            font-size: 14px;
            }
            .meta-left {
            text-align: left;
            }
            .meta-right {
            text-align: right;
            }

          .tables-container {
            display: grid;
            grid-template-columns: 1fr 1fr; /* left | right */
            gap: 10px;
            margin-top: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            page-break-inside: auto; /* allow table to break across pages */
          }

          tr {
            page-break-inside: avoid; /* avoid splitting rows */
            page-break-after: auto;
          }

          th, td {
            border: 1px solid #000;
            padding: 7px;
            text-align: center;
            word-wrap: break-word;
          }

          th {
            
            font-weight: bold;
          }

          /* ===== COLUMN CLASSES ===== */
          .col-day {
            width: 30px;
            max-width: 30px;
            min-width: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: clip;
            padding: 2px;
            font-size: 9px;
          }

          .col-activity {
            width: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 10px;
            padding: 4px;
          }

          .col-location {
            width: auto;
          }

        </style>
      </head>
      <body>

        <h1>Monthly Work Program for In Service Advisors (CGO & Resource Person)</h1>
        <h1>Zonal Education Office - Vavuniya North</h1>
        <h3>${month} ${year}</h3>

        <div class="meta-row">
            <div class="meta-left">
                <strong>Name of the officer:</strong> ${isaName}
            </div>
            <div class="meta-right">
                <strong>Subject:</strong> ..................................................
            </div>
        </div>


        <div class="tables-container">
            <!-- ===== TABLE 1 : PROPOSED ===== -->
            <table>
            <colgroup>
                <col style="width: 30px;" />    <!-- Date -->
                <col style="width: 140px;" />   <!-- Proposed Activities -->
                <col style="width: auto;" />    <!-- Duty Station -->
                <col style="width: 30px;" />    <!-- Division -->
            </colgroup>
            <thead>
                <!-- Grouped header row -->
                <tr>
                <th rowspan="2" class="col-day">Date</th>
                <th colspan="2">Advanced Program</th>
                <th rowspan="2" class="col-day">Div</th>
                </tr>
                <!-- Individual column headers -->
                <tr>
                <th class="col-activity">Activity</th>
                <th class="col-location">Location</th>
                </tr>
            </thead>
            <tbody>
                ${visits
                  .map(
                    (v) => `
                <tr>
                    <td class="col-day">${v.visit_date}</td>
                    <td class="col-activity">${v.duty}</td>
                    <td class="col-location">${v.location_name || '-'}</td>
                    <td class="col-day">1</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
            </table>

            <!-- ===== TABLE 2 : CHANGED ===== -->
            <table>
            <colgroup>
                <col style="width: 30px;" />    <!-- Date -->
                <col style="width: 140px;" />   <!-- Changed Activity -->
                <col style="width: auto;" />    <!-- Location -->
                <col style="width: 100px;" />   <!-- Reason -->
            </colgroup>
            <thead>
                <!-- Grouped header row -->
                <tr>
                <th rowspan="2" class="col-day">Date</th>
                <th colspan="3">Amended Program</th>
                </tr>
                <!-- Individual column headers -->
                <tr>
                <th class="col-activity">Activity</th>
                <th class="col-location">Location</th>
                <th class="col-activity">Reason</th>
                </tr>
            </thead>
            <tbody>
                ${visits
                  .map(
                    (v) => `
                <tr>
                    <td class="col-day">${v.visit_date}</td>
                    <td class="col-activity">${v.actual_duty || '-'}</td>
                    <td class="col-location">${v.actual_location_name || '-'}</td>
                    <td class="col-activity">${v.location_change_reason || '-'}</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
            </table>


        </div>
        <!-- ===== FOOTER DETAILS BELOW TABLES ===== -->
<div style="margin-top:20px; font-size:12px; width:100%;">

 <table style="width:100%; border-collapse: collapse; border:none;">
    <tr>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        ISA's Signature
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        ISA's Signature
      </td>
    </tr>
    
    <tr>
      <td style="width:24%; text-align:center; border:none;">
        Proposed Duties Recommended /<br/> .................................
      </td>
      <td style="width:24%; text-align:center; border:none;">
                                                           
      </td>
      <td style="width:24%; text-align:center; border:none;">
                                                           
      </td>
      <td style="width:24%; text-align:center; border:none;">
        Work done of this month Recommended  / .................................
      </td>
    </tr>
    <tr >
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        ADE/DDE
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        ADE/DDE
      </td>
    </tr>

    <tr>
      <td style="width:24%; text-align:center; border:none;">
        Proposed Duties Approved /<br/> .................................
      </td>
      <td style="width:24%; text-align:center; border:none;">
                                                           
      </td>
      <td style="width:24%; text-align:center; border:none;">
                                                           
      </td>
      <td style="width:24%; text-align:center; border:none;">
        Work done of this month Approved  / .................................
      </td>

         <tr>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        DDE/ZDE
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        Date<br/>
      </td>
      <td style="width:24%; text-align:center; border:none;">
        ................................<br/>
        DDE/ZDE
      </td>
    </tr>
      
     
    </tr>
      
</table>


  <table style="width: 100%; margin-top: 10px; border:1px solid #000; border-collapse:collapse;">
    <tr>
      <td>School Subject Advocation</td>
      <td>    </>
      <td>Govt. Holiday</td>
      <td>    </>
    </tr>
    <tr>
      <td>Facilitation (Quality circle, Marking, WS)</td>
      <td>    </>
      <td>Personal Leave</td>
      <td>    </>
    </tr>
    <tr>
      <td>Zone/Division</td>
      <td>    </>
      <td>Other</td>
      <td>    </>
    </tr>
    <tr>
      <td>Participated (Meeting, Semi., WS)</td>
      <td>    </>
      <td>Total</td>\
      <td>    </>
    </tr>
  </table>

</div>


      </body>
      </html>
    `;

    /* ---------- PDF GENERATION ---------- */
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '5mm', bottom: '5mm' },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ISA_Visit_Report_${month}_${year}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};
