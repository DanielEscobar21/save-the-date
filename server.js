import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import dbPromise from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'build')));

// Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const db = await dbPromise;
    const [rsvps] = await db.execute('SELECT * FROM rsvps ORDER BY timestamp DESC');
    res.json(rsvps);
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    res.status(500).json({ error: 'Error reading RSVPs' });
  }
});

// Add new RSVP
app.post('/api/rsvps', async (req, res) => {
  try {
    const { name, email, phone, attending, hasCompanion, companionName, message } = req.body;

    // Formato compatible con MySQL
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const db = await dbPromise;
    const [result] = await db.execute(`
      INSERT INTO rsvps (name, email, phone, attending, hasCompanion, companionName, message, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, email, phone, attending ? 1 : 0, hasCompanion ? 1 : 0, companionName, message, timestamp]);

    const newRsvp = {
      id: result.insertId,
      name,
      email,
      phone,
      attending,
      hasCompanion,
      companionName,
      message,
      timestamp
    };

    res.status(201).json(newRsvp);
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Error saving RSVP' });
  }
});

// View RSVPs in a table format
app.get('/admin/rsvps', async (req, res) => {
  try {
    const db = await dbPromise;
    const [rsvps] = await db.execute('SELECT * FROM rsvps ORDER BY timestamp DESC');
    const attending = rsvps.filter(rsvp => rsvp.attending === 1);
    const notAttending = rsvps.filter(rsvp => rsvp.attending === 0);

    // Contar asistentes incluyendo acompañantes
    const totalAttending = attending.reduce((sum, rsvp) => sum + 1 + (rsvp.hasCompanion === 1 ? 1 : 0), 0);

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
              <div class="stat-number">${totalAttending}</div>
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
            <h2>Asistentes (${totalAttending})</h2>
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
                ${attending.map(rsvp => {
      const fecha = new Date(rsvp.timestamp).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
      return `
                    <tr>
                      <td>${rsvp.name}</td>
                      <td>${rsvp.email}</td>
                      <td>${rsvp.phone || '-'}</td>
                      <td>${rsvp.hasCompanion === 1 ? 'Sí' : 'No'}</td>
                      <td>${rsvp.companionName || '-'}</td>
                      <td>${rsvp.message || '-'}</td>
                      <td>${fecha}</td>
                    </tr>
                  `;
    }).join('')}
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
                ${notAttending.map(rsvp => {
      const fecha = new Date(rsvp.timestamp).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
      return `
                    <tr>
                      <td>${rsvp.name}</td>
                      <td>${rsvp.email}</td>
                      <td>${rsvp.phone || '-'}</td>
                      <td>${rsvp.message || '-'}</td>
                      <td>${fecha}</td>
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Error loading RSVPs:', error);
    res.status(500).send('Error loading RSVPs');
  }
});

// Generate and download PDF
app.get('/admin/download-pdf', async (req, res) => {
  try {
    const db = await dbPromise;
    const [rsvps] = await db.execute('SELECT * FROM rsvps ORDER BY timestamp DESC');
    const attending = rsvps.filter(rsvp => rsvp.attending === 1);
    const notAttending = rsvps.filter(rsvp => rsvp.attending === 0);

    // Contar asistentes incluyendo acompañantes
    const totalAttending = attending.reduce((sum, rsvp) => sum + 1 + (rsvp.hasCompanion === 1 ? 1 : 0), 0);

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
      .text(`Asistentes: ${totalAttending}    `, { continued: true })
      .text(`No Asistentes: ${notAttending.length}`)
      .moveDown();

    // Add attending guests table
    doc.fontSize(16)
      .fillColor('#8b7355')
      .text('Asistentes', { underline: true })
      .moveDown(0.5);

    // Table headers
    const headers = ['Nombre', 'Email', 'Teléfono', 'Acompañante', 'Nombre Acompañante', 'Mensaje'];
    const colWidths = [120, 180, 100, 80, 140, 200];
    let x = 40;
    let y = doc.y;
    headers.forEach((header, idx) => {
      doc.fontSize(10)
        .fillColor('#000000')
        .text(header, x, y, { width: colWidths[idx], align: 'left' });
      x += colWidths[idx];
    });

    // Table rows
    y += 18; // Espacio después de encabezados
    attending.forEach((rsvp) => {
      x = 40;
      doc.fontSize(8)
        .text(rsvp.name, x, y, { width: colWidths[0] });
      x += colWidths[0];
      doc.text(rsvp.email, x, y, { width: colWidths[1] });
      x += colWidths[1];
      doc.text(rsvp.phone || '-', x, y, { width: colWidths[2] });
      x += colWidths[2];
      doc.text(rsvp.hasCompanion === 1 ? 'Sí' : 'No', x, y, { width: colWidths[3] });
      x += colWidths[3];
      doc.text(rsvp.companionName || '-', x, y, { width: colWidths[4] });
      x += colWidths[4];
      doc.text(rsvp.message || '-', x, y, { width: colWidths[5] });
      y += 16;
      // Salto de página si es necesario
      if (y > doc.page.height - 40) {
        doc.addPage();
        y = 40;
      }
    });

    // Add new page for non-attending guests
    doc.addPage();
    y = 40;
    doc.fontSize(16)
      .fillColor('#8b7355')
      .text('No Asistentes', 40, y, { underline: true });
    y += 28;

    // Table headers for non-attending
    const nonAttendingHeaders = ['Nombre', 'Email', 'Teléfono', 'Mensaje'];
    const nonColWidths = [120, 180, 100, 400];
    x = 40;
    nonAttendingHeaders.forEach((header, idx) => {
      doc.fontSize(10)
        .fillColor('#000000')
        .text(header, x, y, { width: nonColWidths[idx], align: 'left' });
      x += nonColWidths[idx];
    });
    y += 18;

    // Table rows for non-attending
    notAttending.forEach((rsvp) => {
      x = 40;
      doc.fontSize(8)
        .text(rsvp.name, x, y, { width: nonColWidths[0] });
      x += nonColWidths[0];
      doc.text(rsvp.email, x, y, { width: nonColWidths[1] });
      x += nonColWidths[1];
      doc.text(rsvp.phone || '-', x, y, { width: nonColWidths[2] });
      x += nonColWidths[2];
      doc.text(rsvp.message || '-', x, y, { width: nonColWidths[3] });
      y += 16;
      // Salto de página si es necesario
      if (y > doc.page.height - 40) {
        doc.addPage();
        y = 40;
      }
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

// Handle client-side routing - must be after all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 