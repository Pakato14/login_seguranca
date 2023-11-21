const express = require('express')
const user = require('./userRoutes')

module.exports = app =>{
    app.use(express.json(),
    express.urlencoded({
        extended: false
    }),
    user,
    )
}