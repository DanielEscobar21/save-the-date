# Save the Date - RSVP System

Sistema de RSVP para la boda de Ian & Jocelyn.

## Despliegue en Render.com

1. Crear una cuenta en [Render](https://render.com)
2. Conectar con GitHub
3. Crear un nuevo Web Service
4. Seleccionar el repositorio
5. Configurar:
   - Name: save-the-date
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

## Variables de Entorno

No se requieren variables de entorno para la configuración básica.

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm start
```

## Notas Importantes

- Los RSVPs se guardan en un archivo `rsvps.json`
- La vista de administración está en `/admin/rsvps`
- Se puede descargar un PDF con la lista de invitados en `/admin/download-pdf`
