const express = require("express");
const {create_customer, update_customer, get_customer} = require("./customer-service");
const router = express.Router()

router.post('/', (req,res) => {
    create_customer(req.body).then(result => res.send(result))
})

router.put('/', (req, res) => {
        update_customer(req.body).then(result => res.send(result))
    }
)

router.get('/:id', (req, res) => {
    get_customer(req.params.id).then(result => res.send(result))
})

module.exports = router