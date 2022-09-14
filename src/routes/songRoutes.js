const {
  addSong, getSongs, getSong, editSong, deleteSong,
} = require('../handler/songHandler');

const songRoutes = [
  {
    method: 'POST',
    path: '/songs',
    handler: addSong,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: getSongs,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: getSong,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: editSong,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: deleteSong,
  },
];

module.exports = songRoutes;
