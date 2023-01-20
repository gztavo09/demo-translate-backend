const express = require('express');
const crypto = require('crypto');
const firebase = require('firebase-admin');
const socketio = require('socket.io');
const cors = require('cors');

const firebaseConfig = {
    apiKey: "AIzaSyDq6WdWs4x20ue2-DJWuLgSecIo9xaz5F8",
    authDomain: "open-meet-3130f.firebaseapp.com",
    databaseURL: "https://open-meet-3130f-default-rtdb.firebaseio.com",
    projectId: "open-meet-3130f",
    storageBucket: "open-meet-3130f.appspot.com",
    messagingSenderId: "360978459662",
    appId: "1:360978459662:web:6dfc6ddc5ff74d5ab7205f"
  };
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = socketio(server);

app.use(cors());

app.post('/create-session', (req, res) => {
  // Generar código único de 16 caracteres
  const code = crypto.randomBytes(8).toString('hex');

  // Almacenar código en Firebase
  db.ref(`sessions/${code}`).set({
    username: 'Gz',
    code: code
  });

  // Responder con el código generado
  res.json({ code });
});

app.post('/join-session', (req, res) => {
  // Verificar si el código de sesión existe en Firebase
  db.ref(`sessions/${req.body.code}`).once("value")
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

io.on('connection', socket => {
    socket.on('join-session', code => {
        // Unir socket a una sala específica con el código de sesión
        socket.join(code);
    });
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
