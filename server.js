const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config/config");
const { AuthenticationHandler } = require("./auth/JWTConfig");
const { CustomRouterFunctions } = require("./framework/CustomRouter");
const { Logger } = require('./framework/Logger');

const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const showsRouter = require('./routes/shows');
const bookingRouter = require('./routes/booking');
const profileRouter = require('./routes/profile');
const seatsRouter = require('./routes/seats');
const genreRouter = require('./routes/genres');

// Initialize express and set port number
const app = express();
const port = process.env.PORT || config.port;

// Plug in body parser middleware for parsing json requests
app.use(bodyParser.json());

// CORS Support
const cors = require('cors')
app.use(cors())
app.options('*', cors())

// Handle authentication
app.use(AuthenticationHandler);

// Handle custom router functions
app.use(CustomRouterFunctions);

// Handling GET for the API root
app.get("/", (req, res) => {
    res.send("Welcome to the Zomovie API <br> Visit /api for the API functionality.");
});

// Add routers
app.use("/api/users", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/shows", showsRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/profile", profileRouter);
app.use("/api/seats", seatsRouter);
app.use("/api/genres", genreRouter);

// Starting the API
app.listen(port, () => Logger.info(`Zomovie API listening on port ${port}`));

module.exports = app;