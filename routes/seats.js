const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getSeats, markSeats } = require('../db/queries/seats');
const { getShowFromId, decrementTicketsFromShow } = require('../db/queries/shows');
const { getBookingsFromShowAndUser, begin, rollback, commit, insertBooking, getBookingsFromId, getBookingsFromMutualTime } = require('../db/queries/bookings');
const moment = require('moment');

router.get("/:id", async (req, res) => {
    const queryResult = await getSeats(req.params.id);
    res.json(queryResult.rows);
});

router.post("/", requiredParams(["show_id", "selected_seats"]), async (req, res) => {

    const queryResult = await getSeats(req.body.show_id);
    const seats = queryResult.rows;
    const selectedSeats = req.body.selected_seats;
    for(let i=0; i<seats.length; i++){
        if(selectedSeats.indexOf(seats[i].seat_no)>-1){
            return res.sendJsonError("Cannot book selected seats. Please choose different seats");
        }
    }

    const userId = req.UserID;
    try {
        await begin();
        await decrementTicketsFromShow(selectedSeats.length, req.body.show_id);
        const date = new Date();
        const booking = await insertBooking(req.body.show_id, userId, selectedSeats.length, moment(date).format("YYYY/MM/DD HH:mm:ss"));        
        await markSeats(booking.rows[0].id, selectedSeats);
        await commit();

        res.json({ booking_id: booking.rows[0].id });
    } catch (err) {
        console.log(err);
        await rollback();
        res.sendJsonError("Could not book show");
    }
});

module.exports = router;