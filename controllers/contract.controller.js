const express = require('express');
const Contracts = require('../models/contract.model');
const User = require('../models/user.model');
const contractRouter = express.Router();

// create contract
async function auth(  req, res, next) {
        try {
            const { mobile_no, password } = req.headers
            const data = await User.exists({ mobile_no, password });
            if (data) {
                next();
            } else {
                res.send("user not found")
            }
        } catch (error) {
            res.send(error.message).status(404);
        }

    }



contractRouter.post('/contract', auth ,async (req, res) => {
    try {
        const user = Contracts(req.body);
        const data = await user.save()
        res.send(data).status(201)
    } catch (error) {
        res.send(error.message).status(404)
    }

})

//lenders who have given loans to at least n borrowers
contractRouter.get('/contract/total', auth, async (req, res) => {
    const { n } = req.body
    if (n === undefined) {
        return res.send({ message: "Please enter the number of results you want using the 'n' key " })
    }
    try {
        const data = await Contracts.aggregate([
            {
                $group:
                {
                    _id: "$lenderId",

                    count: { $sum: 1 },
                    Total1: { $sum: "$principle" }
                },

            },
            {
                $match: {
                    count: { $gte: n }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "users"
                },
            },

        ])
        data.forEach((ele) => {
            ele.LenderName = ele.users[0].name
            ele.Total = ele.Total1
            delete ele.Total1
            delete ele.users
            delete ele.count
            delete ele._id
        })
        res.send(data).status(201)
    } catch (error) {
        res.send(error.message).status(404)
    }

})

//Accept a number n as input and return n records sorted ascending by number of people they have given loans
contractRouter.get('/contract/count', auth, async (req, res) => {

    const { n } = req.body
    if (n === undefined) {
        return res.send({ message: "Please enter the number of results you want using the 'n' key " })
    }
    if (n <= 0) {
        return res.send({ message: "n should be greater than 0" })
    }
    try {

        const data = await Contracts.aggregate([
            {
                $group:
                {
                    _id: "$lenderId",
                    count: { $sum: 1 },

                },

            },
            {
                $sort: {
                    count: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "users"
                },
            },

        ]).limit(n)


        data.forEach((ele) => {
            ele.LenderName = ele.users[0].name
            ele.Total = ele.count

            delete ele.count

            delete ele.users

            delete ele._id
        })
        res.send(data)
    } catch (error) {
        res.send(error)
    }

})

// Get All Lenders
contractRouter.get('/contract/lender', auth, async (req, res) => {
    try {
        const data = await Contracts.aggregate([
            {
                $group:
                {
                    _id: "$lenderId",

                },

            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "users"
                },
            },

        ])


        data.forEach((ele) => {
            ele.LenderName = ele.users[0].name
            delete ele.users
            delete ele._id
        })
        res.send(data)
    } catch (error) {
        res.send(error.message)
    }

})

// Get All Borrower
contractRouter.get('/contract/borrower', auth, async (req, res) => {

    try {
        const data = await Contracts.aggregate([
            {
                $group:
                {
                    _id: "$borrowerId",

                },

            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "users"
                },
            },

        ])


        data.forEach((ele) => {
            ele.BorrowerName = ele.users[0].name
            delete ele.users
            delete ele._id
        })
        res.send(data)
    } catch (error) {
        res.send(error.message)
    }

})

module.exports = contractRouter;