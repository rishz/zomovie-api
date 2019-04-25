const pool = require('../config');

module.exports = {
    getSeats: async (show_id) => {
        const queryResult = await pool.query('SELECT * FROM seats WHERE show_id = $1', [show_id]);
        return queryResult;
    }
};