const express = require('express');
const router = express.Router();
const jwt = require('../auth/jwtConfig');
const argon2 = require('argon2');
const { requiredParams, requiredParam } = require('../framework/ParamHandler');
const { ErrorHandler } = require('../framework/ErrorHandler');
const pool = require('../db/config');

router.post("/login", requiredParams(["email", "password"]), async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // User found?
    if (queryResult.rows.length == 0) return res.return404Error("user");

    const user = queryResult.rows[0];
    // Check password
    if (!await argon2.verify(user.password.trim(), password)) return res.sendJsonError("You have entered a wrong password");

    // User authenticated, provided them with a bearer token
    const token = jwt.sign(user.user_uuid);

    res.json({token: token});
});

router.post("/register", requiredParams(["email", "password", "first_name", "last_name", "birth_date"]), async (req, res) => {
    // hash password
    const hash = await argon2.hash(req.body.password);

    const email = req.body.email.toLowerCase();

    // Check email not in use
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) return res.sendJsonError("Email already exists. Try Logging in");

    try{
        // Save user in database
        const user = await pool.query('INSERT INTO users (email, password, first_name, last_name, birth_date) VALUES ($1, $2, $3, $4, $5)',
                                [email, hash, req.body.first_name, req.body.last_name, req.body.birth_date]);

        res.sendStatusSuccess();
    } catch (err) { ErrorHandler(err, res); }
});

module.exports = router;