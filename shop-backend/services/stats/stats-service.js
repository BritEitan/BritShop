const dbOperations = require('../../mongo-operations')

async function total_sales_by_day(){
    return await dbOperations.get_client().then(async function(client) {
        const database = client.db("shop")
        const query = [{
            $group:
                {
                    // Group by created date from hashed ID
                    _id: {created_date: { $dateToString: { format: "%Y-%m-%d", date: {$convert:{input:"$_id","to":"date"}}}}},
                    total_sales: {$sum: "$total_price"}
                }
        }]
        return await database.collection("orders").aggregate(query).toArray()
    })
}

async function top_sellers(){
    return await dbOperations.get_client().then(async function(client) {
        const database = client.db("shop")
        const query = [{
            // map each product from order list
            $unwind:
                {
                   path: '$products'
                }
        },
            {
                // reduce - get cost at sale for each product
                $group:
                    {
                        _id: {$toObjectId: '$products.product'},
                        sales: { $sum: '$products.total_price_at_sale'}
                    }}
            ,  {
                $sort: {sales: -1}
            },{$limit: 10},
            {$lookup: {from: 'products', localField: '_id', foreignField: '_id', as:'product_data'}},
                ]


        return await database.collection("orders").aggregate(query).toArray()
    })
}

module.exports = {top_sellers, total_sales_by_day}