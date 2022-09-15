const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

const pool = new Pool();

const addSongService = async ({
  title, year, genre, performer, duration, albumId,
}) => {
  const id = `song-${nanoid(16)}`;

  const query = {
    text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    values: [id, title, year, genre, performer, duration, albumId],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new InvariantError('Lagu gagal ditambahkan');

  return result.rows[0].id;
};

const getSongsService = async ({ title, performer }) => {
  if (title && performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await pool.query(query);
    return result.rows;
  }
  if (title || performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 OR performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  const result = await pool.query('SELECT id, title, performer FROM songs');
  return result.rows;
};

const getSongService = async ({ id }) => {
  const query = {
    text: 'SELECT * FROM songs WHERE id = $1',
    values: [id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');
  return result.rows.map(mapDBToModel)[0];
};

const editSongService = async ({ id }, {
  title, year, genre, performer, duration, albumId,
}) => {
  const query = {
    text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
    values: [title, year, genre, performer, duration, albumId, id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');
};

const deleteSongService = async ({ id }) => {
  const query = {
    text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
    values: [id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Lagu tidak ditemukan');
};

module.exports = {
  addSongService, getSongsService, getSongService, editSongService, deleteSongService,
};
