import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import { fetchVisitsForPdf } from '../models/visitPdfModel.js';
import { transporter } from '../utils/mailer.js';

export const generateVisitPdf = async (req, res) => {
  try {
    const { isa_id, month, year, date, location_id } = req.query;

    if (!isa_id || !month || !year) {
      return res.status(400).json({
        error: 'isa_id, month, and year are required',
      });
    }

    const { visits, counts } = await fetchVisitsForPdf({
      isa_id,
      month,
      year,
      date,
      location_id,
    });
    ////console.log(visits);

    ////console.log(counts);

    // Suppose counts is the array you got from DB

    //  enum('HNST','ADVO','ExEv','Office','HOLI','PL','Parti','Faci','Other')
    const advoCount =
      counts.find((c) => c.actual_duty === 'ADVO')?.duty_count || 0;
    const faciCount =
      counts.find((c) => c.actual_duty === 'Faci')?.duty_count || 0;
    const ExEvCount =
      counts.find((c) => c.actual_duty === 'ExEv')?.duty_count || 0;
    const hnstCount =
      counts.find((c) => c.actual_duty === 'HNST')?.duty_count || 0;
    const OfficeCount =
      counts.find((c) => c.actual_duty === 'Office')?.duty_count || 0;
    const HOLICount =
      counts.find((c) => c.actual_duty === 'HOLI')?.duty_count || 0;
    const PLCount = counts.find((c) => c.actual_duty === 'PL')?.duty_count || 0;
    const PartiCount =
      counts.find((c) => c.actual_duty === 'Parti')?.duty_count || 0;
    const OtherCount =
      counts.find((c) => c.actual_duty === 'Other')?.duty_count || 0;

    const total =
      advoCount +
      faciCount +
      OfficeCount +
      HOLICount +
      PLCount +
      PartiCount +
      OtherCount +
      ExEvCount;

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

 <table style="width:100%; border-collapse: collapse; border:none; margin-top:100px">
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
      <td>${advoCount}</>
      <td>Govt. Holiday</td>
      <td>${HOLICount}</>
    </tr>
    <tr>
      <td>Facilitation (Quality circle, Marking, WS)</td>
      <td>${faciCount}</>
      <td>Personal Leave</td>
      <td>${PLCount}</>
    </tr>
    <tr>
      <td>Zone/Division</td>
      <td>${OfficeCount}</>
      <td>Other</td>
      <td> ${OtherCount}</>
    </tr>
    <tr>
      <td>Participated (Meeting, Semi., WS)</td>
      <td>${PartiCount} </>
      <td>Total</td>\
      <td>${total}</>
    </tr>
  </table>

</div>


      </body>
      </html>
    `;

    /* ---------- PDF GENERATION ---------- */

    //    console.log('Using Chrome:', puppeteer.executablePath());

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--disable-dev-shm-usage',
    //   ],
    // });

    // const browser = await chromium.launch({
    //   headless: true,
    //   args: ['--no-sandbox'],
    // });

    // const page = await browser.newPage();
    // await page.setContent(html);
    // const pdfBuffer = await page.pdf({
    //   format: 'A4',
    //   landscape: true,
    //   printBackground: true,
    // });

    // await browser.close();

    async function launchBrowser() {
      const isFly = !!process.env.FLY_APP_NAME;

      if (isFly) {
        // Fly.io / Docker
        return await puppeteerCore.launch({
          executablePath:
            process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
          headless: true,
          timeout: 60000,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        });
      }

      // Local (Windows / Mac)
      return await puppeteer.launch({
        headless: true,
      });
    }

    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '5mm', bottom: '5mm' },
    });

    await browser.close();

    // const page = await browser.newPage();
    // await page.setContent(html, { waitUntil: 'networkidle0' });

    // const pdfBuffer = await page.pdf({
    //   format: 'A4',
    //   landscape: true,
    //   printBackground: true,
    //   margin: { top: '5mm', bottom: '5mm' },
    // });

    // await browser.close();

    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': `attachment; filename="ISA_Visit_Report_${month}_${year}.pdf"`,
    // });

    // res.send(pdfBuffer);

    const { officer_email } = req.body;

    if (!officer_email) {
      return res.status(400).json({ error: 'Officer email is required' });
    }

    await transporter.sendMail({
      from: '"ISA Management System" <no-reply@isa.lk>',
      to: officer_email,
      subject: `ISA Monthly Report - ${month} ${year}`,
      text: `Dear Officer,

Please find attached the monthly ISA visit report for ${month} ${year}.

Regards,
ISA Management System`,
      attachments: [
        {
          filename: `ISA_Visit_Report_${month}_${year}.pdf`,
          content: pdfBuffer, // 🔥 buffer directly
          contentType: 'application/pdf',
        },
      ],
    });

    res.json({ message: 'PDF generated and emailed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};
