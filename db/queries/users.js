const pool = require('../config');

module.exports = {
    getUserFromId: async (id) => {
        const queryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return queryResult;
    },
    getUserFromEmail: async (email) => {
        const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return queryResult;
    },
    insertUser: async (email, password, first_name, last_name, birth_date) => {
        await pool.query('INSERT INTO users (email, password, first_name, last_name, birth_date) VALUES ($1, $2, $3, $4, $5)',
                                [email, password, first_name, last_name, birth_date]);
    }
};