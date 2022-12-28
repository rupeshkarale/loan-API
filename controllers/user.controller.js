const express = require('express');
const User = require('../models/user.model');
const userRouter = express.Router();

userRouter.post('/user', async (req, res) => {
    const user = User(req.body);
    const data = await user.save()
    res.send(data)
})

module.exports = userRouter