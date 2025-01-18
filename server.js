const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://it26.pages.dev', // Cambia esto al dominio del frontend
        methods: ['GET', 'POST'], // Métodos permitidos
        credentials: true,
    },
});

// Configuración de CORS para el middleware de Express
app.use(cors({
    origin: 'https://it26.pages.dev', // Cambia esto al dominio del frontend
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Estado compartido
let totalAmount = 0;

// Rutas de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Socket.IO: Escuchar conexiones
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Enviar el total inicial
    socket.emit('updateTotal', totalAmount);

    // Manejar donaciones
    socket.on('donate', (amount) => {
        totalAmount += parseFloat(amount || 0);
        console.log(`Donación recibida: ${amount}`);
        io.emit('updateTotal', totalAmount); // Notificar a todos
    });

    // Manejar restas
    socket.on('subtract', (amount) => {
        totalAmount -= parseFloat(amount || 0);
        console.log(`Monto restado: ${amount}`);
        io.emit('updateTotal', totalAmount); // Notificar a todos
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
