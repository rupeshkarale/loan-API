const express = require("express");
const connection = require("./config/db.js");
const userRouter = require('./controllers/user.controller')
const contractRouter = require('./controllers/contract.controller')
// const expenceRouter = require('./controllers/expence.controller')
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use('/', expenceRouter)
app.use('/', userRouter);
app.use('/', contractRouter);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = process.env.PORT || 8080;

//connection to database
app.listen(port, async (req, res) => {
    try {
        await connection;
        console.log("connected");
    } catch (error) {
        console.log(error.message);
    }
});
