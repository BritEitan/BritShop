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

async function find_products(search_string, brand, price_range, category, sub_category, offset, limit){
    const filters = []

    // Create special text filter for search_string
    if (search_string){
        filters.push( {
                'name' : 'title',
                'value' : search_string,
                'type': 'SEARCH'
            }
        )
        // get all tokens from the string
        let search_string_n_grams = createEdgeNGrams(search_string)

        // Prepare LIKE filter for each field on all tokens
        search_string_n_grams.forEach(ngram => {
            ['title', 'brand', 'sub_category', 'category'].forEach(column => {
                filters.push({name: column, value: ngram, type: 'LIKE'})
            })
        })
    }
    if (price_range){
        filters.push({name: "price",
            value: price_range, type: 'RANGE'})
    }
    if (category){
        filters.push({name: "category",
            value: category, type: 'MATCH'})
    }
    if (sub_category){
        filters.push({name: "sub_category",
            value: sub_category, type: 'MATCH'})
    }
    if (brand){
        filters.push({name: 'brand', value: brand, type: 'MATCH'})
    }
    return await dbOperations.find_records('products', filters, offset, limit)
}

async function create_product(product){
    if(product.price &&
        product.vendor
        && product.category
        && product.sub_category
        && product.title
        && product.image_url && product.brand){
        return dbOperations.create_record('products', product)
    }
    throw 'Bad Request'
}

async function update_product(product){
    if(product.price &&  product._id &&
        product.vendor
        && product.category
        && product.sub_category
        && product.title
        && product.image_url && product.brand){

        return dbOperations.update_record('products', ObjectId(product._id), product)
    }
    throw 'Bad Request'
}

async function get_product(id){
    return dbOperations.find_record('products', ObjectId(id))
}

async function remove_product(id){
    return dbOperations.remove_record('products', ObjectId(id))
}

module.exports = {find_products, create_product, update_product, get_product, remove_product}