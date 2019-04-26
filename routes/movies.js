const express = require('express');
const router = express.Router();
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const { getMovieFromId, insertMovie, getMovies, getRowCount, getFilteredMovies, getRowCountForGenre } = require('../db/queries/movies');
const { insertMovieGenre } = require('../db/queries/moviegenres');

router.post("/", requiredParams(["id", "name", "plot", "count_shows", "category",
    "rating", "poster_url", "backdrop_url", "duration", "genres"]), async (req, res) => {

        // Movie already exists?
        const result = await getMovieFromId(req.body.id);
        if (result.rows.length > 0) return res.sendJsonError("Movie already exists");

        try {
            await insertMovie(req.body.id, req.body.name, req.body.plot, req.body.rating, req.body.count_shows,
                req.body.category, req.body.poster_url, req.body.backdrop_url, req.body.duration);

            for (let i = 0; i < req.body.genres.length; i++) {
                await insertMovieGenre(req.body.id, req.body.genres[i]);
            }
            res.sendStatusSuccess();
        } catch (err) {
            res.sendJsonError("Movie could not be saved");
        }
    });

router.get("/:id", async (req, res) => {
    try {
        const queryResult = await getMovieFromId(req.params.id);
        if (queryResult.rows.length == 0) return res.return404Error("movie");

        res.json(queryResult.rows[0]);
    } catch (err) { ErrorHandler(err, res); }
});

router.get("/", async (req, res) => {
    // paginate
    const skip = req.body.page || req.query.page || 0;
    const search = req.query.search || req.param.search || '';

    
    try {
        const genre = req.param.genre || req.body.genre || req.query.genre;
        let movies, count;

        if(genre){
            movies = await getFilteredMovies(search, skip, genre);    
            count = await getRowCountForGenre(search, genre);
        } else{
            count = await getRowCount(search);
            movies = await getMovies(search, skip);
        }

        for (let i = 0; i < movies.rows.length; i++) {
            movies.rows[i].row_count = count.rows[0].count;
        }
        res.json(movies.rows);
    } catch (err) { ErrorHandler(err, res); }
});

module.exports = router;