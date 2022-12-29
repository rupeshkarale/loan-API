const express = require('express');
const Contracts = require('../models/contract.model');
const contractRouter = express.Router();

// create contract
contractRouter.post('/contract', async (req, res) => {
    try {
        const user = Contracts(req.body);
        const data = await user.save()
        res.send(data).status(201)
    } catch (error) {
        res.send(error.message).status(404)
    }

})

//lenders who have given loans to at least n borrowers
contractRouter.get('/contract/total', async (req, res) => {
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
contractRouter.get('/contract/count', async (req, res) => {

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
contractRouter.get('/contract/lender', async (req, res) => {
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
contractRouter.get('/contract/borrower', async (req, res) => {

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