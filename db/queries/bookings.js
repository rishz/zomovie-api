const pool = require('../config');

module.exports = {
    getBookingsFromShowAndUser: async (user_id, show_id) => {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 AND show_id = $2', [user_id, show_id]);
        return result;
    },
    rollback: async () => {
        await pool.query('ROLLBACK');
    },
    begin: async () => {
        await pool.query('BEGIN');
    },
    commit: async () => {
        await pool.query('COMMIT');
    },
    insertBooking: async (show_id, user_id, count_tickets, booking_time) => {
        const res = await pool.query('INSERT INTO bookings (show_id, user_id, count_tickets, booking_time) VALUES ($1, $2, $3, $4) RETURNING id', [show_id, user_id, count_tickets, booking_time]);
        return res;
    },
    getBookingsFromId: async (id) => {
        const queryResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        return queryResult;
    },
    getBookingsFromMutualTime: async (start_time) => {
        const queryResult = await pool.query('SELECT * FROM bookings INNER JOIN shows ON shows.id = bookings.show_id WHERE shows.end_time >= $1', [start_time]);
        return queryResult;
    },
    getBookingsFromUser: async (user_id) => {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_time DESC', [user_id]);
        return result;
    }
};