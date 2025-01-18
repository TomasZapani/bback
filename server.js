const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://it26.pages.dev', // Dominio del frontend
        methods: ['GET', 'POST'], // Métodos permitidos
        credentials: true, // Permitir cookies o credenciales si es necesario
    },
});

// Configuración de CORS para el middleware de Express
app.use(cors({
    origin: 'https://it26.pages.dev', // Dominio del frontend
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    credentials: true, // Si necesitas enviar cookies o encabezados de autenticación
}));

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Estado compartido
let totalAmount = 0; // Total compartido entre todos los usuarios

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Enviar el total actual al usuario recién conectado
    socket.emit('updateTotal', totalAmount);

    // Escuchar donaciones del cliente
    socket.on('donate', (amount) => {
        console.log(`Donación recibida: ${amount}`);
        totalAmount += parseFloat(amount);
        io.emit('updateTotal', totalAmount); // Enviar el total actualizado a todos los usuarios
    });

    // Escuchar restas del administrador
    socket.on('subtract', (amount) => {
        console.log(`Monto restado: ${amount}`);
        totalAmount -= parseFloat(amount);
        io.emit('updateTotal', totalAmount); // Enviar el total actualizado a todos los usuarios
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
