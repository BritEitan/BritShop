const express = require("express");
const {get_collection} = require("./filter-metadata-service");
const router = express.Router()

router.get('/categories', (req, res) => {
        get_collection('categories').then(result => res.send(result))
    }
)

router.get('/brands', (req, res) => {
        get_collection('brands').then(result => res.send(result))
    }
)

router.get('/vendors', (req, res) => {
        get_collection('vendors').then(result => res.send(result))
    }
)


module.exports = router