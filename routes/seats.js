const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getSeats } = require('../db/queries/seats');

router.get("/:id", async (req, res) => {
    const queryResult = await getSeats(req.params.id);
    if (queryResult.rows.length == 0) {
        return res.return404Error("show");
    }
    res.json(queryResult.rows[0]);
});

router.post("/", requiredParams(["show_id", "selected_seats"]), async (req, res) => {

    const queryResult = await getSeats(req.body.show_id);
    if(queryResult.rows.length == 0){ return res.return404Error("show"); }
    const show = queryResult.rows[0];
    const booked = show.booked.split('');
    const pending = show.pending.split('');
    const selectedSeats = req.body.selected_seats;
    for(let i=0; i<selected_seats.length; i++){
        if(booked[selectedSeats[i]] == 1 || pending[selectedSeats[i]] == 1){
            return res.sendJsonError("Cannot book selected seats. Please choose different seats");
        }
    }

    for(let i=0; i<selected_seats.length; i++){
        pending[selectedSeats[i]] = 1;
    }

    try {
        await begin();
        await decrementTicketsFromShow(req.body.tickets, req.body.show_id);
        const date = new Date();
        await insertBooking(req.body.show_id, userId, req.body.tickets, moment(date).format("YYYY/MM/DD HH:mm:ss"));
        await commit();

        const booking = await getBookingsFromShowAndUser(userId, req.body.show_id);
        res.json({ booking_id: booking.rows[0].id });
    } catch (err) {
        console.log(err);
        await rollback();
        res.sendJsonError("Could not book ");
    }
});

module.exports = router;