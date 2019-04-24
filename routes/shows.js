const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getShowFromId, getShows, getShowsFromMovie } = require('../db/queries/shows');

router.get("/", async(req, res) => {
    // paginate
    const skip = req.body.page || req.query.page || 0;

    try{
        const shows = await getShows(skip);
        res.json(shows.rows);
    } catch (err) { ErrorHandler(err, res); }
});

router.get("/:id", async (req,res) => {
    try{
        const queryResult = await getShowFromId(req.params.id);
        if (queryResult.rows.length == 0) return res.return404Error("show");

        res.json(queryResult.rows[0]);
    }catch (err) { ErrorHandler(err,res); }
});

router.get("/movie/:id", async (req, res) => {
    try{
        const queryResult = await getShowsFromMovie(req.params.id);
        if (queryResult.rows.length == 0) return res.return404Error("show");
        res.json(queryResult.rows);
    }catch (err) { ErrorHandler(err,res); }
});

module.exports = router;