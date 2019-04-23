const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getBookingsFromUser } = require('../db/queries/bookings');
const { getUserFromId } = require('../db/queries/users');

router.get("/history", async(req, res) => {

    const queryResult = await getBookingsFromUser(req.UserID);
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