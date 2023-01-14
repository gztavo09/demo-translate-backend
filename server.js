// Importar las dependencias necesarias
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
// Importar cors
const cors = require('cors');
// Crear una instancia de express
const app = express();

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Crear un servidor http utilizando la instancia de express
const server = http.createServer(app);

// Inicializar Socket.io en el servidor
const io = socketio(server);

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
const port = 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});