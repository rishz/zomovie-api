const Promise = require('bluebird');
const request = require('request-promise');
const pool = require('../config');

const API_KEY = "782d09c794b975bed7c9d274b2a9f17d";
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

let makeRequestGenres = async (url) => {
    const json = await request(url)
    results = JSON.parse(json);
    for (let i = 0; i < results.genres.length; i++) {
        let id = results.genres[i].id;
        let name = results.genres[i].name;
        await pool.query('INSERT INTO genres (id, name) VALUES ($1, $2);', [id, name]);
    }
}

let ids = [];
let makeRequestMovies = async (url) => {

    let json = await request(url);
    results = JSON.parse(json).results;
    console.log(results.length);
    for (let i = 0; i < results.length; i++) {
        let id = results[i].id;
        ids.push(id);
    }
}

let getMovie = async (id) => {

    url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US1`;
    poster_base = `http://image.tmdb.org/t/p/w185/`;
    backdrop_base = `http://image.tmdb.org/t/p/w780/`;

    let json = await request(url);

    movie = JSON.parse(json);
    let obj = {};
    obj.id = movie.id;
    obj.backdrop_url = backdrop_base + movie.backdrop_path;
    obj.poster_url = poster_base + movie.poster_path;
    obj.rating = movie.vote_average;
    obj.duration = movie.runtime;
    obj.name = movie.title;
    obj.plot = movie.overview;
    obj.count_shows = Math.floor((Math.random() * 200) + 30);
    obj.category = (movie.adult == true ? "A" : "U/A");
    obj.genres = [];
    for (let i = 0; i < movie.genres.length; i++) {
        obj.genres.push(movie.genres[i].id);
    }
    await request(options = {
        method: 'POST',
        uri: 'http://localhost:8000/api/movies',
        body: obj,
        json: true
    });
}

timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getMoviesUrl = (page) => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
}

const recurse = async (page) => {
    await makeRequestGenres(genreUrl);
    ids = [];
    await makeRequestMovies(getMoviesUrl(page));
    console.log(ids);
    for (let i = 0; i < ids.length; i++) {
        // await timeout(100);
        console.log("doing");
        try {
            await getMovie(ids[i]);
            console.log('++');
        } catch (err) { continue; };
    }
    await addMovies(page + 1);
}

module.exports = {
    addMovies: async () => {
        await recurse(1);
    }
}