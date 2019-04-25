const pool = require('../config');

module.exports = {
    getSeats: async (show_id) => {
        const queryResult = await pool.query('SELECT seats.seat_no FROM seats INNER JOIN bookings ON seats.booking_id = bookings.id WHERE bookings.show_id=$1', [show_id]);
        return queryResult;
    },
    markSeats: async (booking_id, selected_seats) => {
        for(let i=0; i<selected_seats.length; i++){
            await pool.query('INSERT INTO seats (booking_id, seat_no) VALUES ($1, $2)',[booking_id, selected_seats[i]]);
        }
    },
    getSeatsFromBooking: async (booking_id) => {
        const queryResult = await pool.query('SELECT seat_no FROM seats WHERE booking_id=$1', [booking_id]);
        return queryResult;
    }
};