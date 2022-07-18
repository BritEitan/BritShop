const express = require("express");
const {create_order, update_order, find_orders, remove_order, get_order} = require("./order-service");
const {response} = require("express");
const router = express.Router()

router.post('/', (req,res) => {
    create_order(req.body).then(result => res.send(result))
})

router.put('/', (req, res) => {
        update_order(req.body).then(result => {
            res.send(result)
        })
    }
)

router.get('/search-orders', (req, res) => {

    // Find orders && transform range params
    find_orders(req.query.search_string, !isNaN(req.query.total_order_min) || !isNaN(req.query.total_order_max) ?
            {   min: isNaN(req.query.total_order_min) ? 0 : Number(req.query.total_order_min),
                max: isNaN(req.query.total_order_max) ? undefined:  Number(req.query.total_order_max)
            } : undefined,
        req.query.date_min || req.query.date_max ?
            {   min: req.query.date_min ? req.query.date_min : undefined,
                max: req.query.date_max ? req.query.date_max : undefined
            } : undefined,
        Number(req.query.offset), Number(req.query.limit)).then(result => res.send(result))
    }
)

router.get('/:id', (req, res) =>{
    get_order(req.params.id).then(result => res.send(result))
})

router.delete('/:id', (req, res)=>{
    remove_order(req.params.id).then(result => res.send(result))
})


module.exports = router