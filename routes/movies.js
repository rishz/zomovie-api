const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const pool = require('../db/config');

router.post("/", requiredParams(["id", "name", "plot", "count_shows", "category", 
                    "rating", "poster_url", "backdrop_url", "duration", "genres"]), async (req, res) => {

    // Movie already exists?
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [req.body.id]);
    if (result.rows.length > 0) return res.sendJsonError("Movie already exists");

    try{
        await pool.query('INSERT INTO movies (id, name, plot, rating, count_shows, category, poster_url, backdrop_url, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                                [req.body.id, req.body.name, req.body.plot, req.body.rating, req.body.count_shows,
                                    req.body.category, req.body.poster_url, req.body.backdrop_url, req.body.duration]);

        for(let i=0; i<req.body.genres.length; i++){
            await pool.query('INSERT INTO moviegenres (movie_id, genre_id) VALUES ($1, $2)', [req.body.id, req.body.genres[i]]);
        }
        res.sendStatusSuccess();
    } catch (err) {
        res.sendJsonError("Movie could not be saved");
    }
});

module.exports = router;