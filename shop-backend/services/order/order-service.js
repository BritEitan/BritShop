const dbOperations = require('../../mongo-operations')
const {ObjectId} = require("mongodb");

function createEdgeNGrams(str) {
    if (str && str.length > 2) {
        const minGram = 2
        const maxGram = str.length

        return str.split(" ").reduce((ngrams, token) => {
            if (token.length > minGram) {
                for (let i = minGram; i <= maxGram && i <= token.length; ++i) {
                    ngrams = [...ngrams, token.substr(0, i)]
                }
            } else {
                ngrams = [...ngrams, token]
            }
            return ngrams
        }, [])
    }

    return [str]
}

async function find_orders(search_string, total_price_range, date_range, offset, limit){
    const filters = []
    if (search_string.length > 0){
        filters.push( {
                'name' : 'title',
                'value' : search_string,
                'type': 'SEARCH'
            }
        )
        let search_string_n_grams = createEdgeNGrams(search_string)
        search_string_n_grams.forEach(ngram => {
            ['customer', 'shipping.address', 'shipping.city', 'shipping.postal_code'].forEach(column => {
                filters.push({name: column, value: ngram, type: 'LIKE'})
            })
        })
    }
    if (total_price_range){
        filters.push({name: "total_price",
            value: total_price_range, type: 'RANGE'})
    }
    if(date_range){
        filters.push({value: date_range, type: 'CREATED_AT_RANGE'})
    }


    return await dbOperations.find_records('orders', filters, offset, limit)
}


async function remove_order(id){
    return dbOperations.remove_record('orders', ObjectId(id))
}

async function get_order(id){
    return dbOperations.find_record('orders', ObjectId(id))
}

async function create_order(order){
    if(order.products &&
        order.customer
        && order.shipping && order.payment_info
        )
    {
        order.total_price = 0;
        // calculate total price of order
        order.products.forEach(product => order.total_price += product.price_at_sale * product.quantity)
        return dbOperations.create_record('orders', order)
    }
    throw 'Bad Request'
}

async function update_order(order){
    if(order.products &&
        order.customer
        && order.shipping && order.payment_info
    ){
        order.total_price = 0;
        // calculate total price of order
        order.products.forEach(product => order.total_price += product.price_at_sale * product.quantity)
        return dbOperations.update_record('orders', ObjectId(order._id), order)
    }
    throw 'Bad Request'
}

module.exports = {create_order, update_order, remove_order, find_orders, get_order}