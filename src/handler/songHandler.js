const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { validatePayload } = require('../validator/validator');
const InvariantError = require('../exceptions/InvariantError');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');

const pool = new Pool();

const addSong = async (request, h) => {
  try {
    validatePayload('songs', request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new InvariantError('Lagu gagal ditambahkan');

    const response = h.response({
      status: 'success',
      data: {
        songId: id,
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
  const { title, performer } = request.query;
  if (title && performer) {
    console.log(title, performer);
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await pool.query(query);

    const response = h.response({
      status: 'success',
      data: {
        songs: result.rows,
      },
    });

    response.code(200);
    return response;
  }
  if (title || performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 OR performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await pool.query(query);
    console.log(result.rows);
    const response = h.response({
      status: 'success',
      data: {
        songs: result.rows,
      },
    });

    response.code(200);
    return response;
  }

  const result = await pool.query('SELECT id, title, performer FROM songs');
  return {
    status: 'success',
    data: {
      songs: result.rows,
    },
  };
};

const getSong = async (request, h) => {
  try {
    const { id } = request.params;

    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');

    const response = h.response({
      status: 'success',
      data: {
        song: result.rows[0],
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
    const { id } = request.params;
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');

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
    const { id } = request.params;

    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');

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
