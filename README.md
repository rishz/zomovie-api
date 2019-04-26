# Zomovie-API

Zomovie API built in Node.js and Express with PostgreSQL database.

## Installation
  - Create Role in the db
  `CREATE ROLE me WITH LOGIN PASSWORD 'rishz';`

  - Create database
  `CREATE DATABASE zomovie;`

  - Connect to the database
  `psql postgres -d zomovie -U me;`

  - Create UUID-OSSP extension in db
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

  - Run create table script
  `npm run dbscript`

  - Grant privileges
  `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO me`

  - Install node dependencies
  `npm i`

  - Add data to the db from data folder

## Start the API
  - `npm start`