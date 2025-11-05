const Playlist = require('../models/Playlist');
const Song = require('../models/song');

exports.createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = new Playlist({ name, description, owner: req.user.id, songs: [] });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando playlist' });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const lists = await Playlist.find().populate('owner', 'name').populate('songs');
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo playlists' });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description, songId, action } = req.body;
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ message: 'Playlist no encontrada' });
    if (pl.owner.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    if (name) pl.name = name;
    if (description) pl.description = description;

    if (songId && action === 'add') {
      const song = await Song.findById(songId);
      if (song && !pl.songs.includes(songId)) pl.songs.push(songId);
    } else if (songId && action === 'remove') {
      pl.songs = pl.songs.filter(s => s.toString() !== songId);
    }

    await pl.save();
    res.json(pl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando playlist' });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ message: 'Playlist no encontrada' });
    if (pl.owner.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    await pl.remove();
    res.json({ message: 'Playlist eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando playlist' });
  }
};
