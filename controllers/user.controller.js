const express = require('express');
const User = require('../models/user.model');
const userRouter = express.Router();

//create user
userRouter.post('/user', async (req, res) => {
    try {
        const user = User(req.body);
        const data = await user.save()
        res.send(data).status(201);
        
    } catch (error) {
        res.send(error.message);
    }
    
})

module.exports = userRouter