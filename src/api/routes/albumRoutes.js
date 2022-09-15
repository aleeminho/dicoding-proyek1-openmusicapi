const {
  getAlbum, postAlbum, putAlbum, deleteAlbum,
} = require('../handler/albumHandler');

const albumRoutes = [
  {
    method: 'POST',
    path: '/albums',
    handler: postAlbum,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbum,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: putAlbum,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbum,
  },
];

module.exports = albumRoutes;
