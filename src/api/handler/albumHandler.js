const { validatePayload } = require('../../validator/index');
const ClientError = require('../../exceptions/ClientError');
const {
  postAlbumServices, getAlbumServices, putAlbumServices, deleteAlbumServices,
} = require('../../services/postgres/albumServices');

const postAlbum = async (request, h) => {
  try {
    validatePayload('album', request.payload);
    const albumId = await postAlbumServices(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        albumId,
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
      status: 'fail',
      message: 'Maaf terjadi kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const getAlbum = async (request, h) => {
  try {
    const albumDetails = await getAlbumServices(request.params);

    const response = h.response({
      status: 'success',
      data: {
        album: albumDetails,
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
      message: 'Maaf terjadi kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const putAlbum = async (request, h) => {
  try {
    validatePayload('album', request.payload);

    await putAlbumServices(request.params, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diubah',
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
      message: 'Maaf terjadi kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

const deleteAlbum = async (request, h) => {
  try {
    await deleteAlbumServices(request.params);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
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
      message: 'Maaf terjadi kesalahan di sisi server',
    });

    response.code(500);
    console.error(e);
    return response;
  }
};

module.exports = {
  getAlbum, postAlbum, putAlbum, deleteAlbum,
};
