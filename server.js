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
app.use(express.static('build')); // Servir archivos estáticos del frontend

// Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const db = await dbPromise;
    const rsvps = await db.all('SELECT * FROM rsvps ORDER BY timestamp DESC');
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Error reading RSVPs' });
  }
});

// Add new RSVP
app.post('/api/rsvps', async (req, res) => {
  try {
    const { name, email, phone, attending, hasCompanion, companionName, message } = req.body;
    const timestamp = new Date().toISOString();

    const db = await dbPromise;
    const result = await db.run(`
      INSERT INTO rsvps (name, email, phone, attending, hasCompanion, companionName, message, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, email, phone, attending ? 1 : 0, hasCompanion ? 1 : 0, companionName, message, timestamp]);

    const newRsvp = {
      id: result.lastID,
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
    res.status(500).json({ error: 'Error saving RSVP' });
  }
});

// View RSVPs in a table format
app.get('/admin/rsvps', async (req, res) => {
  try {
    const db = await dbPromise;
    const rsvps = await db.all('SELECT * FROM rsvps ORDER BY timestamp DESC');
    const attending = rsvps.filter(rsvp => rsvp.attending === 1);
    const notAttending = rsvps.filter(rsvp => rsvp.attending === 0);

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
                    <td>${rsvp.phone || '-'}</td>
                    <td>${rsvp.hasCompanion === 1 ? 'Sí' : 'No'}</td>
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
                    <td>${rsvp.phone || '-'}</td>
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
app.get('/admin/download-pdf', async (req, res) => {
  try {
    const db = await dbPromise;
    const rsvps = await db.all('SELECT * FROM rsvps ORDER BY timestamp DESC');
    const attending = rsvps.filter(rsvp => rsvp.attending === 1);
    const notAttending = rsvps.filter(rsvp => rsvp.attending === 0);

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

    // Add attending guests table
    doc.fontSize(16)
      .fillColor('#8b7355')
      .text('Asistentes', { underline: true })
      .moveDown();

    // Table headers
    const headers = ['Nombre', 'Email', 'Teléfono', 'Acompañante', 'Nombre Acompañante', 'Mensaje'];
    let x = 40;
    headers.forEach(header => {
      doc.fontSize(10)
        .fillColor('#000000')
        .text(header, x, doc.y, { width: 100 });
      x += 100;
    });

    // Table rows
    attending.forEach(rsvp => {
      doc.moveDown()
        .fontSize(8)
        .text(rsvp.name, 40, doc.y, { width: 100 })
        .text(rsvp.email, 140, doc.y, { width: 100 })
        .text(rsvp.phone || '-', 240, doc.y, { width: 100 })
        .text(rsvp.hasCompanion === 1 ? 'Sí' : 'No', 340, doc.y, { width: 100 })
        .text(rsvp.companionName || '-', 440, doc.y, { width: 100 })
        .text(rsvp.message || '-', 540, doc.y, { width: 100 });
    });

    // Add new page for non-attending guests
    doc.addPage()
      .fontSize(16)
      .fillColor('#8b7355')
      .text('No Asistentes', { underline: true })
      .moveDown();

    // Table headers for non-attending
    const nonAttendingHeaders = ['Nombre', 'Email', 'Teléfono', 'Mensaje'];
    x = 40;
    nonAttendingHeaders.forEach(header => {
      doc.fontSize(10)
        .fillColor('#000000')
        .text(header, x, doc.y, { width: 150 });
      x += 150;
    });

    // Table rows for non-attending
    notAttending.forEach(rsvp => {
      doc.moveDown()
        .fontSize(8)
        .text(rsvp.name, 40, doc.y, { width: 150 })
        .text(rsvp.email, 190, doc.y, { width: 150 })
        .text(rsvp.phone || '-', 340, doc.y, { width: 150 })
        .text(rsvp.message || '-', 490, doc.y, { width: 150 });
    });

    doc.end();
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 