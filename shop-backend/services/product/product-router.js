const express = require("express");
const {response} = require("express");
const {create_product, update_product, find_products, get_product, remove_product} = require("./product-service");
const router = express.Router()


router.post('/', (req,res) => {
    create_product(req.body).then(result => res.send(result))
})

router.delete('/:id', (req, res)=>{
    remove_product(req.params.id).then(result => res.send(result))
})

router.get('/search-products', (req, res) => {
        find_products(req.query.search_string, req.query.brand,!isNaN(req.query.price_min) || !isNaN(req.query.price_max) ?
                {   min: isNaN(req.query.price_min) ? 0 : Number(req.query.price_min),
                    max: isNaN(req.query.price_max) ? undefined:  Number(req.query.price_max)
                } : undefined,
            req.query.category, req.query.sub_category, Number(req.query.offset),
            Number(req.query.limit)).then(result => res.send(result))
    }
)

router.get('/:id', (req,res) => {
    get_product(req.params.id).then(result => {
        res.send(result)
    })
})

router.put('/', (req, res) => {
        update_product(req.body).then(result => {
            res.send(result)
        })
    }
)



module.exports = router