// Importar las dependencias necesarias
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const firebase = require('firebase-admin');
// Importar cors
const cors = require('cors');
const path = require('path');
// Crear una instancia de express
const app = express();

const firebaseConfig = {
    apiKey: "AIzaSyDq6WdWs4x20ue2-DJWuLgSecIo9xaz5F8",
    authDomain: "open-meet-3130f.firebaseapp.com",
    projectId: "open-meet-3130f",
    storageBucket: "open-meet-3130f.appspot.com",
    messagingSenderId: "360978459662",
    appId: "1:360978459662:web:6dfc6ddc5ff74d5ab7205f"
};
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.use(cors());

// Crear un servidor http utilizando la instancia de express
const server = http.createServer(app);

// Inicializar Socket.io en el servidor
const socketio = require('socket.io');
const io = socketio(server);

app.post('/create-session', (req, res) => {
    // Generar código único de 16 caracteres
    const code = crypto.randomBytes(8).toString('hex');
  
    // Almacenar código en Firebase
    firebase.database().ref(`sessions/${code}`).set({
      code: code
    });
  
    // Responder con el código generado
    res.json({ code });
  });
  
  app.post('/join-session', (req, res) => {
    // Verificar si el código de sesión existe en Firebase
    firebase.database().ref(`sessions/${req.body.code}`).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          // Responder con éxito si el código existe
          res.json({ success: true });
        } else {
          // Responder con error si el código no existe
          res.status(404).json({ error: 'Session not found' });
        }
      });
  });

// Escuchar para conexiones de socket
io.on('connection', socket => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('join-session', code => {
        // Unir socket a una sala específica con el código de sesión
        socket.join(code);
    });

    // Escuchar para el evento "send message" desde el cliente
    socket.on('send message', message => {
        console.log('Mensaje recibido:', message);

        // Enviar el mensaje a todos los clientes conectados
        io.to(data.code).emit('new message', message);
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
