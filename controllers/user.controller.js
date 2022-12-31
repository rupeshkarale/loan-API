const express = require('express');
const User = require('../models/user.model');
const userRouter = express.Router();


//create user
userRouter.post('/user', async (req, res) => {
    const { mobile_no } = req.body
    const data = await User.exists( {mobile_no} )
// console.log(data)

    data = {
        name:"bbj"
    }
    
    console.log(data);
    if (data) {
       return res.send("mobile number exist") 
    }

    try {
        const user = User(req.body);
        const data = await user.save()
        res.send(data).status(201);
        
    } catch (error) {
        res.send(error.message);
    }
    
})

module.exports = userRouter