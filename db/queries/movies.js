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
    },
    getMovies: async (search, skip) => {
        search = search+'%'
        const movies = await pool.query('SELECT * FROM movies WHERE name ILIKE $1 ORDER BY id ASC LIMIT 20 OFFSET $2', [search, skip*20]);
        return movies;
    },
    getMovieFromShow: async (show_id) => {
        const queryResult = await pool.query('SELECT name FROM movies WHERE id IN (SELECT movie_id FROM SHOWS where ID=$1)', [show_id]);
        return queryResult;
    },
    getRowCount: async (search) => {
        search = search+'%'
        const count = await pool.query('SELECT COUNT(*) FROM movies WHERE name ILIKE $1',[search]);
        return count;
    }
};