const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

const pool = new Pool();

const postAlbumServices = async ({ name, year }) => {
  const id = `album-${nanoid(16)}`;

  const query = {
    text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
    values: [id, name, year],
  };
  const result = await pool.query(query);

  if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan');

  return result.rows[0].id;
};

const getAlbumServices = async ({ id }) => {
  const songQuery = {
    text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
    values: [id],
  };
  const songResult = await pool.query(songQuery);

  const query = {
    text: 'SELECT * FROM albums WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    year: result.rows[0].year,
    songs: songResult.rows,
  };
};

const putAlbumServices = async ({ id }, { name, year }) => {
  const query = {
    text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
    values: [name, year, id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Gagal mengubah album. Album tidak ditemukan');
};

const deleteAlbumServices = async ({ id }) => {
  const query = {
    text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
    values: [id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) throw new NotFoundError('Gagal menghapus album. Album tidak ditemukan');
};

module.exports = {
  postAlbumServices, getAlbumServices, putAlbumServices, deleteAlbumServices,
};
