const { validatePayload } = require('../../validator/index');
const ClientError = require('../../exceptions/ClientError');
const {
  addSongService, getSongsService, getSongService, editSongService, deleteSongService,
} = require('../../services/postgres/songServices');

const addSong = async (request, h) => {
  try {
    validatePayload('songs', request.payload);

    const songId = await addSongService(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  } catch (e) {
    if (e instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: e.message,
      });

      response.code(e.statusCode);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: 'Maaf ada kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const getSongs = async (request, h) => {
  const songs = await getSongsService(request.query);
  const response = h.response({
    status: 'success',
    data: {
      songs,
    },
  });

  response.code(200);
  return response;
};

const getSong = async (request, h) => {
  try {
    const song = await getSongService(request.params);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });

    response.code(200);
    return response;
  } catch (e) {
    if (e instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: e.message,
      });

      response.code(e.statusCode);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Maaf ada kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const editSong = async (request, h) => {
  try {
    validatePayload('songs', request.payload);

    await editSongService(request.params, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diubah',
    });

    response.code(200);
    return response;
  } catch (e) {
    if (e instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: e.message,
      });

      response.code(e.statusCode);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Maaf ada kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const deleteSong = async (request, h) => {
  try {
    await deleteSongService(request.params);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });

    response.code(200);
    return response;
  } catch (e) {
    if (e instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: e.message,
      });

      response.code(e.statusCode);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: e.message,
    });

    response.code(400);
    return response;
  }
};

module.exports = {
  addSong, getSongs, getSong, editSong, deleteSong,
};
