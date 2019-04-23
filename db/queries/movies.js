const pool = require('../config');

module.exports = {
    getMovieFromId: async (id) => {
        const queryResult = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        return queryResult;
    },
    insertMovie: async (id, name, plot, rating, count_shows, category, poster_url, backdrop_url, duration) => {
        await pool.query('INSERT INTO movies (id, name, plot, rating, count_shows, category, poster_url, backdrop_url, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                                [id, name, plot, rating, count_shows,
                                    category, poster_url, backdrop_url, duration]);
    }
};