const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./key/serviceAccountKey.json');
const crypto = require("crypto");
const socketio = require('socket.io');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://open-meet-3130f-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = socketio(server);

app.use(cors());

app.post('/create-session', (req, res) => {
    // Generar código único de 16 caracteres
    const code = crypto.randomBytes(8).toString('hex');
  
    // Almacenar código en Firebase
    db.collection('sessions').doc(code);
  
    // Responder con el código generado
    res.json({ code });
});

function checkCodeExists(code) {
    return db.collection('sessions').doc(code).get().then(doc => {
      if (doc.exists) {
        return true;
      } else {
        return false;
      }
    });
}
  
io.on('connection', socket => {
    socket.on('join-session', code => {
        // Unir socket a una sala específica con el código de sesión;
        socket.join(code);
        socket.emit("joined", `Te has unido a la reunión ${code}`);
    });
    socket.on('send message', values => {
        console.log('Mensaje recibido:', values.message);
        // Enviar el mensaje a todos los clientes conectados
        io.to(values.code).emit('new message', { 
            id: values.id,
            lang: values.lang,
            message: values.message
        });
    });

    // Escuchar para desconexiones de socket
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});