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

// Delete RSVP
app.delete('/api/rsvps/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = await dbPromise;
    const [result] = await db.execute('DELETE FROM rsvps WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    res.status(200).json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ error: 'Error deleting RSVP' });
  }
});

// Update RSVP
app.put('/api/rsvps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, attending, hasCompanion, companionName, message } = req.body;

    const db = await dbPromise;
    const [result] = await db.execute(`
      UPDATE rsvps 
      SET name = ?, email = ?, phone = ?, attending = ?, 
          hasCompanion = ?, companionName = ?, message = ?
      WHERE id = ?
    `, [name, email, phone, attending ? 1 : 0, hasCompanion ? 1 : 0, companionName, message, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    // Obtener el RSVP actualizado
    const [updatedRsvp] = await db.execute('SELECT * FROM rsvps WHERE id = ?', [id]);

    res.status(200).json(updatedRsvp[0]);
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ error: 'Error updating RSVP' });
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
            .action-buttons {
              display: flex;
              gap: 5px;
            }
            .edit-btn, .delete-btn {
              padding: 5px 10px;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              font-size: 12px;
            }
            .edit-btn {
              background-color: #4CAF50;
              color: white;
            }
            .delete-btn {
              background-color: #f44336;
              color: white;
            }
            .modal {
              display: none;
              position: fixed;
              z-index: 1;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              background-color: rgba(0,0,0,0.4);
            }
            .modal-content {
              background-color: #fefefe;
              margin: 10% auto;
              padding: 20px;
              border: 1px solid #888;
              width: 50%;
              border-radius: 5px;
            }
            .close {
              color: #aaa;
              float: right;
              font-size: 28px;
              font-weight: bold;
              cursor: pointer;
            }
            .form-group {
              margin-bottom: 15px;
            }
            .form-group label {
              display: block;
              margin-bottom: 5px;
              font-weight: bold;
            }
            .form-group input, .form-group textarea, .form-group select {
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .save-btn {
              background-color: #4CAF50;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
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
                  <th>Acciones</th>
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
                      <td>
                        <div class="action-buttons">
                          <button class="edit-btn" onclick="openEditModal(${JSON.stringify(rsvp).replace(/"/g, '&quot;')})">Editar</button>
                          <button class="delete-btn" onclick="deleteRsvp(${rsvp.id})">Eliminar</button>
                        </div>
                      </td>
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
                  <th>Acciones</th>
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
                      <td>
                        <div class="action-buttons">
                          <button class="edit-btn" onclick="openEditModal(${JSON.stringify(rsvp).replace(/"/g, '&quot;')})">Editar</button>
                          <button class="delete-btn" onclick="deleteRsvp(${rsvp.id})">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Modal para editar RSVP -->
          <div id="editModal" class="modal">
            <div class="modal-content">
              <span class="close" onclick="closeEditModal()">&times;</span>
              <h2>Editar RSVP</h2>
              <form id="editForm">
                <input type="hidden" id="rsvpId">
                <div class="form-group">
                  <label for="name">Nombre:</label>
                  <input type="text" id="name" required>
                </div>
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" required>
                </div>
                <div class="form-group">
                  <label for="phone">Teléfono:</label>
                  <input type="text" id="phone">
                </div>
                <div class="form-group">
                  <label for="attending">Asistirá:</label>
                  <select id="attending" onchange="toggleCompanionFields()">
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div id="companionSection">
                  <div class="form-group">
                    <label for="hasCompanion">Llevará acompañante:</label>
                    <select id="hasCompanion" onchange="toggleCompanionNameField()">
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                  <div class="form-group" id="companionNameGroup">
                    <label for="companionName">Nombre del acompañante:</label>
                    <input type="text" id="companionName">
                  </div>
                </div>
                <div class="form-group">
                  <label for="message">Mensaje:</label>
                  <textarea id="message" rows="3"></textarea>
                </div>
                <button type="button" class="save-btn" onclick="saveRsvp()">Guardar cambios</button>
              </form>
            </div>
          </div>

          <script>
            // Función para abrir el modal de edición
            function openEditModal(rsvp) {
              document.getElementById('rsvpId').value = rsvp.id;
              document.getElementById('name').value = rsvp.name;
              document.getElementById('email').value = rsvp.email;
              document.getElementById('phone').value = rsvp.phone || '';
              document.getElementById('attending').value = rsvp.attending;
              document.getElementById('hasCompanion').value = rsvp.hasCompanion;
              document.getElementById('companionName').value = rsvp.companionName || '';
              document.getElementById('message').value = rsvp.message || '';
              
              toggleCompanionFields();
              toggleCompanionNameField();
              
              document.getElementById('editModal').style.display = 'block';
            }
            
            // Función para cerrar el modal
            function closeEditModal() {
              document.getElementById('editModal').style.display = 'none';
            }
            
            // Función para mostrar/ocultar campos relacionados con acompañante
            function toggleCompanionFields() {
              const attending = document.getElementById('attending').value === '1';
              document.getElementById('companionSection').style.display = attending ? 'block' : 'none';
            }
            
            // Función para mostrar/ocultar el campo del nombre del acompañante
            function toggleCompanionNameField() {
              const hasCompanion = document.getElementById('hasCompanion').value === '1';
              document.getElementById('companionNameGroup').style.display = hasCompanion ? 'block' : 'none';
            }
            
            // Función para guardar cambios en el RSVP
            async function saveRsvp() {
              const id = document.getElementById('rsvpId').value;
              const rsvpData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                attending: document.getElementById('attending').value === '1',
                hasCompanion: document.getElementById('hasCompanion').value === '1',
                companionName: document.getElementById('companionName').value,
                message: document.getElementById('message').value
              };
              
              try {
                const response = await fetch(\`/api/rsvps/\${id}\`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(rsvpData)
                });
                
                if (response.ok) {
                  alert('RSVP actualizado correctamente');
                  closeEditModal();
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(\`Error al actualizar: \${error.error}\`);
                }
              } catch (error) {
                alert('Error al actualizar el RSVP');
                console.error(error);
              }
            }
            
            // Función para eliminar un RSVP
            async function deleteRsvp(id) {
              if (!confirm('¿Estás seguro que deseas eliminar este RSVP?')) {
                return;
              }
              
              try {
                const response = await fetch(\`/api/rsvps/\${id}\`, {
                  method: 'DELETE'
                });
                
                if (response.ok) {
                  alert('RSVP eliminado correctamente');
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(\`Error al eliminar: \${error.error}\`);
                }
              } catch (error) {
                alert('Error al eliminar el RSVP');
                console.error(error);
              }
            }
          </script>
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