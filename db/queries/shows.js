const pool = require('../config');

module.exports = {
    getShowFromId: async (show_id) => {

        const result = await pool.query('SELECT * FROM shows WHERE id = $1;', [show_id]);
        return result;
    },
    decrementTicketsFromShow: async (tickets, show_id) => {
        await pool.query('UPDATE shows SET count_tickets = count_tickets - $1 WHERE id = $2', [tickets, show_id]);
    },
    getShows: async (skip) => {
        const shows = await pool.query('SELECT * FROM shows ORDER BY start_time ASC LIMIT 20 OFFSET $1', [skip*20]);
        return shows;
    },
    getShowsFromMovie: async (movie_id) => {
        const shows = await pool.query('SELECT id, start_time FROM shows WHERE movie_id = $1 ORDER BY start_time', [movie_id]);
        return shows;
    }
};