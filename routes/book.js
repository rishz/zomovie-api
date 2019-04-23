const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const pool = require('../db/config');
const { ShowService } = require("../services/ShowService");

const ss = ShowService;

router.get("/", async(req, res) => {
    // paginate
    const skip = req.body.skip || req.query.skip || 0;

    try{
        const shows = await ss.getShows(skip);
        res.json(movies);
    } catch (err) { ErrorHandler(err, res); }
});

module.exports = router;