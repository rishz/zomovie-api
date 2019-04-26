const { addMovies } = require('./addMovies');
const { createTables } = require('./setupDb');
const { addShowsForMovie } = require('./addShows');

(async () => {
    try {
        await createTables();
        await addMovies(1);
        await addShowsForMovie();
    } catch (err) { console.log(err); }
})();