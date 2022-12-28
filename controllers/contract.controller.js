const express = require('express');
const Contracts = require('../models/contract.model');
const contractRouter = express.Router();

contractRouter.post('/contract', async (req, res) => {
    try {
        const user = Contracts(req.body);
        const data = await user.save()
        res.send(data).status(401)
    } catch (error) {
        res.send(error).status(404)
    }

})
contractRouter.get('/contract/all', async (req, res) => {
    const { n } = req.body
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
        res.send(data)
    } catch (error) {
        res.send(error)
    }

})

contractRouter.get('/contract/count', async (req, res) => {

    const { n } = req.body
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
                    Total: 1
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


module.exports = contractRouter;