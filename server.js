const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const cors = require('cors');
app.use(cors({
    origin: 'https://it26.pages.dev' // Tu dominio de frontend en Cloudflare
  }));
  

let totalAmount = 0; // Total compartido entre todos los usuarios

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Enviar el total actual al usuario recién conectado
    socket.emit('updateTotal', totalAmount);

    // Escuchar donaciones del cliente
    socket.on('donate', (amount) => {
        totalAmount += parseFloat(amount);
        io.emit('updateTotal', totalAmount); // Enviar el total actualizado a todos los usuarios
    });

    // Escuchar restas del administrador
    socket.on('subtract', (amount) => {
        totalAmount -= parseFloat(amount);
        io.emit('updateTotal', totalAmount); // Enviar el total actualizado a todos los usuarios
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor





const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
