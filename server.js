const express = require('express');
const { nanoid } = require('nanoid');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos temporal en memoria
const enlaces = {};

// Servir la interfaz de usuario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para recibir los links y generar el enlace único
app.post('/generar', (req, res) => {
    const { video, monetag } = req.body;
    const id = nanoid(6); // Crea un ID corto de 6 caracteres
    
    enlaces[id] = { video, monetag };
    
    const miLinkUnico = `${req.protocol}://${req.get('host')}/ir/${id}`;
    res.json({ link: miLinkUnico });
});

// Ruta de redirección y monetización
app.get('/ir/:id', (req, res) => {
    const data = enlaces[req.params.id];
    
    if (data) {
        res.send(`
            <html>
                <head>
                    <title>Cargando...</title>
                    <meta charset="UTF-8">
                </head>
                <body style="background:#111; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0;">
                    <div style="text-align:center;">
                        <h2>Procesando tu enlace...</h2>
                        <p>Espera un momento mientras cargamos el contenido.</p>
                    </div>
                    <script>
                        // Abre el enlace de Monetag en una pestaña nueva
                        window.open("${data.monetag}", "_blank");
                        
                        // Redirige la pestaña actual al video después de 3 segundos
                        setTimeout(() => {
                            window.location.href = "${data.video}";
                        }, 3000);
                    </script>
                </body>
            </html>
        `);
    } else {
        res.status(404).send('Enlace no encontrado o expirado');
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));