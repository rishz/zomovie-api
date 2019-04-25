const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getBookingsFromUser } = require('../db/queries/bookings');
const { getUserFromId } = require('../db/queries/users');
const { getMovieFromShow } = require('../db/queries/movies');

router.get("/history", async(req, res) => {
    const queryResult = await getBookingsFromUser(req.UserID);
    for(let i=0; i<queryResult.rows.length; i++){
        let movieResult = await getMovieFromShow(queryResult.rows[i].show_id);
        queryResult.rows[i].movie = movieResult.rows[0].name;
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