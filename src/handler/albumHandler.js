const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { validatePayload } = require('../validator/validator');
const InvariantError = require('../exceptions/InvariantError');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');

const pool = new Pool();

const postAlbum = async (request, h) => {
  try {
    validatePayload('album', request.payload);

    const { name, year } = request.payload;
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan');

    const response = h.response({
      status: 'success',
      data: {
        albumId: result.rows[0].id,
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
    const { id } = request.params;

    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };

    const songResult = await pool.query(songQuery);

    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');

    const response = h.response({
      status: 'success',
      data: {
        album: {
          id: result.rows[0].id,
          name: result.rows[0].name,
          year: result.rows[0].year,
          songs: songResult.rows,
        },
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
    const { id } = request.params;
    const { name, year } = request.payload;

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 returning id',
      values: [name, year, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Gagal mengubah album, album tidak ditemukan');

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
    const { id } = request.params;
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan');

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
