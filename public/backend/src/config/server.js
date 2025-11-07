// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // <-- se conecta a MongoDB

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ejemplo simple para probar
app.get('/', (req, res) => {
  res.send('API de Plataforma de Música funcionando 🎵');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
