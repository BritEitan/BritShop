const express = require("express");
const {response} = require("express");
const {top_sellers, total_sales_by_day} = require("./stats-service");
const router = express.Router()

router.get('/sales-by-day', (req, res) => {
        total_sales_by_day().then(result => res.send(result))
    }
)

router.get('/top-sellers', (req, res) => {
       top_sellers().then(result => {
           res.send(result)
       })
    }
)

module.exports = router