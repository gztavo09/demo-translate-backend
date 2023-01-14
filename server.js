// Importar las dependencias necesarias
const express = require('express');
const http = require('http');

// Importar cors
const cors = require('cors');
const path = require('path');
// Crear una instancia de express
const app = express();

app.use(cors({
    origin: 'https://sparkling-cat-ef36f2.netlify.app/'
}));

// Crear un servidor http utilizando la instancia de express
const server = http.createServer(app);

// Inicializar Socket.io en el servidor
const socketio = require('socket.io');
const io = new socketio.Server(server, {
    path: "/"
});

// Escuchar para conexiones de socket
io.on('connection', socket => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Escuchar para el evento "send message" desde el cliente
    socket.on('send message', message => {
        console.log('Mensaje recibido:', message);

        // Enviar el mensaje a todos los clientes conectados
        io.emit('new message', message);
    });

    // Escuchar para desconexiones de socket
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Escuchar en un puerto específico
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
