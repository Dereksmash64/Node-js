const express = require('express');
const router = express.Router();
const songCtrl = require('../controllers/songController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload').single('mp3'); // campo 'mp3'

/**
 * Public:
 * GET /api/songs -> lista de canciones
 * GET /api/songs/:id -> detalle
 * GET /api/songs/file/:filename -> servir mp3
 *
 * Protected (ej: subir, update, delete):
 * POST /api/songs -> subir canción (auth + multer)
 * PUT /api/songs/:id -> actualizar (auth + multer opcional)
 * DELETE /api/songs/:id -> eliminar (auth)
 */

router.get('/', songCtrl.getSongs);
router.get('/:id', songCtrl.getSongById);
router.get('/file/:filename', songCtrl.streamSongFile);

// upload requiere token
router.post('/', auth, (req, res, next) => {
  upload(req, res, function (err) {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, songCtrl.createSong);

// update con posible nuevo mp3
router.put('/:id', auth, (req, res, next) => {
  upload(req, res, function (err) {
    if (err && err.message !== 'No file') return res.status(400).json({ message: err.message });
    next();
  });
}, songCtrl.updateSong);

router.delete('/:id', auth, songCtrl.deleteSong);

module.exports = router;
