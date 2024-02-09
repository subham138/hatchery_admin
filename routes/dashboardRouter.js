const express = require('express'),
    dashRouter = express.Router()

dashRouter.get("/dashboard", (req, res) => {
    res.render('dashboard')
})

module.exports = {dashRouter}