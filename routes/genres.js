const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getGenres } = require('../db/queries/genres');

router.get("/", async (req,res) => {
    try{
        const queryResult = await getGenres();
        res.json(queryResult.rows);
    }catch (err) { ErrorHandler(err,res); }
});

module.exports = router;