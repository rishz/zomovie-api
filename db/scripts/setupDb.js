const pool = require('../config');
const config = require('../../config/config');

module.exports = {
    // Add all tables
    createTables: async () => {
        try {

            // await createDb();
            
            await pool.query(`CREATE TABLE bookings (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        show_id uuid NOT NULL,
        user_id uuid NOT NULL,
        count_tickets smallint NOT NULL,
        booking_time timestamp without time zone NOT NULL)`);

            await pool.query(`CREATE TABLE genres (
        id integer PRIMARY KEY,
        name character varying(255))`);

            await pool.query(`CREATE TABLE moviegenres (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        movie_id integer NOT NULL,
        genre_id integer NOT NULL)`);

            await pool.query(`CREATE TABLE movies (
        id integer PRIMARY KEY,
        name character varying(255) NOT NULL,
        plot text NOT NULL,
        rating real,
        count_shows smallint NOT NULL,
        category character varying(255) NOT NULL,
        poster_url character varying(255),
        backdrop_url character varying(255),
        duration smallint NOT NULL)`);

            await pool.query(`CREATE TABLE seats (
        booking_id uuid NOT NULL,
        seat_no smallint NOT NULL)`);

            await pool.query(`CREATE TABLE shows (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        start_time timestamp without time zone NOT NULL,
        end_time timestamp without time zone NOT NULL,
        movie_id integer NOT NULL,
        count_tickets integer NOT NULL)`);

            await pool.query(`CREATE TABLE users (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        email character varying(255) NOT NULL,
        password character varying(255) NOT NULL,
        first_name character varying(255),
        last_name character varying(255),
        birth_date date NOT NULL)`);

        } catch (err) { console.log(err); }
    }
}