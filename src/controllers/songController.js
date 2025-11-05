const Song = require('../models/song');
const fs = require('fs');
const path = require('path');

exports.createSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Archivo mp3 requerido' });
    if (!title || !artist) return res.status(400).json({ message: 'Título y artista requeridos' });

    const newSong = new Song({
      title,
      artist,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploader: req.user ? req.user.id : null
    });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando canción' });
  }
};

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('uploader', 'name email').sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo canciones' });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('uploader', 'name email');
    if (!song) return res.status(404).json({ message: 'Canción no encontrada' });
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo canción' });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Canción no encontrada' });

    // opcional: solo permiso del uploader
    if (req.user && song.uploader && song.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    if (title) song.title = title;
    if (artist) song.artist = artist;

    // si suben nuevo mp3 en update
    if (req.file) {
      // borrar antiguo archivo
      const oldPath = path.join(__dirname, '..', '..', 'uploads', song.filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      song.filename = req.file.filename;
      song.mimetype = req.file.mimetype;
      song.size = req.file.size;
    }

    await song.save();
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando canción' });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Canción no encontrada' });

    // permiso del uploader
    if (req.user && song.uploader && song.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', song.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await song.remove();
    res.json({ message: 'Canción eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando canción' });
  }
};

// endpoint para servir mp3
exports.streamSongFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Archivo no encontrado');

  res.sendFile(filePath);
};
