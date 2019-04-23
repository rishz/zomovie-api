const pool = require('../config');

module.exports = {
    insertMovieGenre: async (movie_id, genre_id) => {
        await pool.query('INSERT INTO moviegenres (movie_id, genre_id) VALUES ($1, $2)', [movie_id, genre_id]);
    }
};