import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build')); // Servir archivos estáticos del frontend

// File path for storing RSVPs
const RSVP_FILE = path.join(__dirname, 'rsvps.json');

// Ensure the file exists
if (!fs.existsSync(RSVP_FILE)) {
  fs.writeFileSync(RSVP_FILE, JSON.stringify([]));
}

// Get all RSVPs
app.get('/api/rsvps', (req, res) => {
  try {
    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8'));
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Error reading RSVPs' });
  }
});

// Add new RSVP
app.post('/api/rsvps', (req, res) => {
  try {
    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8'));
    const newRsvp = {
      ...req.body,
      timestamp: new Date().toISOString()
    };
    rsvps.push(newRsvp);
    fs.writeFileSync(RSVP_FILE, JSON.stringify(rsvps, null, 2));
    res.status(201).json(newRsvp);
  } catch (error) {
    res.status(500).json({ error: 'Error saving RSVP' });
  }
});

// View RSVPs in a table format
app.get('/admin/rsvps', (req, res) => {
  try {
    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8'));
    const attending = rsvps.filter(rsvp => rsvp.attending);
    const notAttending = rsvps.filter(rsvp => !rsvp.attending);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RSVPs</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .table-container {
              margin-bottom: 40px;
            }
            h2 {
              color: #8b7355;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              margin-bottom: 40px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #8b7355;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .attending {
              color: green;
            }
            .not-attending {
              color: red;
            }
            .stats {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .stat-item {
              text-align: center;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #8b7355;
            }
            .stat-label {
              color: #666;
            }
            .download-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #8b7355;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-bottom: 20px;
              transition: background-color 0.3s;
            }
            .download-button:hover {
              background-color: #a67c52;
            }
          </style>
        </head>
        <body>
          <h1>RSVPs</h1>
          
          <a href="/admin/download-pdf" class="download-button">Descargar PDF</a>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">${attending.length}</div>
              <div class="stat-label">Asistentes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${notAttending.length}</div>
              <div class="stat-label">No Asistentes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${rsvps.length}</div>
              <div class="stat-label">Total Respuestas</div>
            </div>
          </div>

          <div class="table-container">
            <h2>Asistentes (${attending.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acompañante</th>
                  <th>Nombre Acompañante</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${attending.map(rsvp => `
                  <tr>
                    <td>${rsvp.name}</td>
                    <td>${rsvp.email}</td>
                    <td>${rsvp.phone}</td>
                    <td>${rsvp.hasCompanion ? 'Sí' : 'No'}</td>
                    <td>${rsvp.companionName || '-'}</td>
                    <td>${rsvp.message || '-'}</td>
                    <td>${new Date(rsvp.timestamp).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="table-container">
            <h2>No Asistentes (${notAttending.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${notAttending.map(rsvp => `
                  <tr>
                    <td>${rsvp.name}</td>
                    <td>${rsvp.email}</td>
                    <td>${rsvp.phone}</td>
                    <td>${rsvp.message || '-'}</td>
                    <td>${new Date(rsvp.timestamp).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading RSVPs');
  }
});

// Generate and download PDF
app.get('/admin/download-pdf', (req, res) => {
  try {
    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8'));
    const attending = rsvps.filter(rsvp => rsvp.attending);
    const notAttending = rsvps.filter(rsvp => !rsvp.attending);

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 40
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rsvps.pdf');

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header with title
    doc.fontSize(28)
      .fillColor('#8b7355')
      .text('Lista de RSVPs', { align: 'left' })
      .fontSize(14)
      .text('Boda de Ian & Jocelyn', { align: 'left' })
      .moveDown();

    // Add statistics
    doc.fontSize(14)
      .text('Estadísticas', { continued: true })
      .text(`    Total: ${rsvps.length}    `, { continued: true })
      .text(`Asistentes: ${attending.length}    `, { continued: true })
      .text(`No Asistentes: ${notAttending.length}`)
      .moveDown();

    // Add date
    doc.fontSize(10)
      .fillColor('#666666')
      .text(`Generado el ${new Date().toLocaleDateString()}`)
      .moveDown();

    // Function to create table
    const createTable = (title, headers, data, rowFormatter) => {
      // Add table title
      doc.fontSize(16)
        .fillColor('#8b7355')
        .text(title)
        .moveDown(0.5);

      const pageWidth = doc.page.width - 80;
      const colWidth = pageWidth / headers.length;

      // Draw table headers
      doc.fontSize(11)
        .fillColor('#ffffff');

      let currentX = 40;
      let currentY = doc.y;

      // Header background
      doc.rect(currentX, currentY, pageWidth, 25)
        .fill('#8b7355');

      // Header texts
      headers.forEach((header, i) => {
        doc.fillColor('#ffffff')
          .text(header,
            currentX + 5,
            currentY + 7,
            { width: colWidth - 10 });
        currentX += colWidth;
      });

      doc.moveDown(0.5);

      // Draw rows
      data.forEach((item, index) => {
        currentY = doc.y;
        currentX = 40;

        // Row background for even rows
        if (index % 2 === 0) {
          doc.rect(currentX, currentY, pageWidth, 25)
            .fill('#f5f5f5');
        }

        // Row data
        const rowData = rowFormatter(item);
        rowData.forEach(text => {
          doc.fillColor('#000000')
            .fontSize(10)
            .text(text,
              currentX + 5,
              currentY + 7,
              { width: colWidth - 10 });
          currentX += colWidth;
        });

        doc.moveDown(0.5);
      });

      doc.moveDown();
    };

    // Create attending table
    createTable(
      'Asistentes',
      ['Nombre', 'Email', 'Teléfono', 'Acompañante', 'Nombre Acompañante'],
      attending,
      (rsvp) => [
        rsvp.name,
        rsvp.email,
        rsvp.phone,
        rsvp.hasCompanion ? 'Sí' : 'No',
        rsvp.companionName || '-'
      ]
    );

    // Add page break
    doc.addPage({
      size: 'A4',
      layout: 'landscape',
      margin: 40
    });

    // Create non-attending table
    createTable(
      'No Asistentes',
      ['Nombre', 'Email', 'Teléfono', 'Mensaje'],
      notAttending,
      (rsvp) => [
        rsvp.name,
        rsvp.email,
        rsvp.phone,
        rsvp.message || '-'
      ]
    );

    // Add footer
    doc.fontSize(8)
      .fillColor('#666666')
      .text(
        'Generado el ' + new Date().toLocaleDateString(),
        40,
        doc.page.height - 40,
        { align: 'left' }
      );

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 