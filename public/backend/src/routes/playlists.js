const express = require('express');
const router = express.Router();
const playlistCtrl = require('../controllers/playlistController');
const auth = require('../middlewares/auth');

router.get('/', playlistCtrl.getPlaylists);
router.post('/', auth, playlistCtrl.createPlaylist);
router.put('/:id', auth, playlistCtrl.updatePlaylist);
router.delete('/:id', auth, playlistCtrl.deletePlaylist);

module.exports = router;
