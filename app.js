global.dotenv = require("dotenv").config();

const express = require('express');
const userRouter = require('./api/routes/userRouter');
const cors = require("cors");
const database = require("./db/connect");

// database.sync({force: true});
database.sync();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', userRouter); //middleware

module.exports = app;