const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getShowFromId, decrementTicketsFromShow } = require('../db/queries/shows');
const { getBookingsFromShowAndUser, begin, rollback, commit, insertBooking, getBookingsFromId, getBookingsFromMutualTime } = require('../db/queries/bookings');
const moment = require('moment');

router.post("/", requiredParams(["show_id", "tickets"]), async(req, res) => {

    const queryResult = await getShowFromId(req.body.show_id);
    if (queryResult.rows.length == 0) return res.return404Error("show");

    const show = queryResult.rows[0];
    if(show.count_tickets == 0){
        return res.sendJsonError("Show is full");
    } else if(show.count_tickets < req.body.tickets){
        return res.sendJsonError("Show has lesser tickets available");
    }

    const userId = req.UserID;

    try{
        await begin();
        await decrementTicketsFromShow(req.body.tickets, req.body.show_id);
        const date = new Date();
        await insertBooking(req.body.show_id, userId, req.body.tickets, moment(date).format("YYYY/MM/DD HH:mm:ss"));
        await commit();

        const booking = await getBookingsFromShowAndUser(userId, req.body.show_id);
        res.json({ booking_id: booking.rows[0].id});
    } catch (err) {
        console.log(err);
        await rollback();
        res.sendJsonError("Could not book show");
    }
});

router.get("/:id", async (req,res) => {
    try{
        const queryResult = await getBookingsFromId(req.params.id);
        if (queryResult.rows.length == 0) return res.return404Error("booking");

        res.json(queryResult.rows[0]);
    }catch (err) { ErrorHandler(err,res); }
});

router.post("/check", requiredParam("show_id"), async (req,res) => {
    const showQuery = await getShowFromId(req.body.show_id);
    if (showQuery.rows.length == 0) return res.return404Error("show");
    const show = showQuery.rows[0];
    const queryResult = await getBookingsFromMutualTime(show.start_time);

    if(queryResult.rows.length == 0) return res.sendStatusSuccess();
    else{
        res.json(queryResult.rows[0]);
    }
});

module.exports = router;