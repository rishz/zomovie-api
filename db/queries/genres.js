const pool = require('../config');

module.exports = {
    getGenres: async () => {
        const queryResult = await pool.query('SELECT * FROM genres');
        return queryResult;
    }
};