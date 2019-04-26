const pool = require('../config');

randomDate = (start, end, startHour, endHour) => {
    let date = new Date(+start + Math.random() * (end - start));
    let hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
}

module.exports = {
    addShowsForMovie: async () => {
        const results = await pool.query('SELECT * FROM movies');
        console.log(results.rows.length);
        for (let k = 0; k < results.rows.length; k++) {
            let showCount = results.rows[k].count_shows;
            let movieId = results.rows[k].id;
            let duration = results.rows[k].duration;
            let numShows = showCount / 10;

            let d = new Date();
            for (i = 0; i < 10; i++) {
                d.setDate(d.getDate() + 1);
                for (j = 0; j < numShows; j++) {
                    let date = randomDate(d, d, 8, 23);
                    let start = moment(date).format("YYYY/MM/DD HH:mm:ss");
                    date.setMinutes(date.getMinutes() + duration);
                    let end = moment(date).format("YYYY/MM/DD HH:mm:ss");
                    await pool.query('INSERT INTO shows (start_time, end_time, movie_id, count_tickets) VALUES ($1, $2, $3, $4)', [start, end, movieId, 100]);
                }
            }
        }
    }
}