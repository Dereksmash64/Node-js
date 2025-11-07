const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  filename: { type: String, required: true }, // nombre del archivo mp3 en uploads/
  mimetype: { type: String },
  size: { type: Number },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
