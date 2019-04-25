const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getBookingsFromUser } = require('../db/queries/bookings');
const { getUserFromId } = require('../db/queries/users');
const { getMovieFromShow } = require('../db/queries/movies');
const { getSeatsFromBooking } = require('../db/queries/seats');

router.get("/history", async(req, res) => {
    const queryResult = await getBookingsFromUser(req.UserID);
    for(let i=0; i<queryResult.rows.length; i++){
        let movieResult = await getMovieFromShow(queryResult.rows[i].show_id);
        if(movieResult.rows.length > 0) queryResult.rows[i].movie = movieResult.rows[0].name;
        const seats = [];
        const seatsResult = await getSeatsFromBooking(queryResult.rows[i].id);
        for(let j=0; j<seatsResult.rows.length; j++){
            seats.push(seatsResult.rows[j].seat_no);
        }
        queryResult.rows[i].seats = seats;
    }
    res.json(queryResult.rows);
});

router.get("/", async (req,res) => {
    try{
        const queryResult = await getUserFromId(req.UserID);
        const user = queryResult.rows[0];
        user.password = undefined;
        res.json(user);
    } catch (err) { ErrorHandler(err,res); }
});

module.exports = router;