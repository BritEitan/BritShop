const {ObjectId, ObjectID} = require("mongodb");
const mongo_client = require('mongodb').MongoClient;
const mongo_url = "mongodb://localhost:27017/";

const mongo_functions = {
    // find by id
    find_record: async function(collection, id_filter) {
        return await mongo_client.connect(mongo_url).then(async function(client){
                const database = client.db("shop")
                return database.collection(collection).findOne({_id: id_filter})
            }
        )
    },

    // search
    find_records: async function(collection, filters, offset, limit) {
        return await mongo_client.connect(mongo_url).then(async function(client) {
                const database = client.db("shop")
                let query = {}
                let or_query = []
                let sort = {}
                filters.forEach(filter => {
                    switch (filter.type) {
                        case 'MATCH':
                            query[filter.name] = filter.value
                            break
                        case 'RANGE':
                            query[filter.name] = {$gte: filter.value.min}
                            if (filter.value.max) {
                                query[filter.name]['$lte'] = filter.value.max
                            }

                            break
                        case 'CREATED_AT_RANGE':
                            let expr = {"$and": {}}
                            if (filter.value.min){
                                expr["$and"]['$gte'] = [   { $dateToString: { format: "%Y-%m-%d", date: {$convert:{input:"$_id","to":"date"}}}}, filter.value.min]
                            }
                            if (filter.value.max){
                                expr["$and"]['$lte'] = [   { $dateToString: { format: "%Y-%m-%d", date: {$convert:{input:"$_id","to":"date"}}}}, filter.value.max]
                            }

                            query['$expr'] = expr
                            break

                        // ngram search filters Aho-Corasick
                        case 'SEARCH':
                            // search by entire words on text index
                            or_query.push({$text: {$search: filter.value}})

                            // sort by most matching words
                            sort = {'score': {'$meta': 'textScore'}}
                            break

                        // ngram search filters Aho-Corasick
                        case 'LIKE':
                            or_query.push({[filter.name]: {$regex: '.*' + filter.value + '.*', $options: 'i' }})
                            break
                        default:
                            break
                    }
                })

                // 1 match required for search text filters
                if (or_query.length > 0) {
                    query["$or"] = or_query
                }
                console.log(query)

                const total_query_result = limit ? await database.collection(collection).find(query).sort(sort).skip(offset).limit(limit).toArray() :
                    await database.collection(collection).find(query).sort(sort).skip(offset).toArray()
                const total_count = await database.collection(collection).countDocuments(query)
                return {items: total_query_result, total_count:  total_count}
            }
        )
    },

    create_record: async function(collection, record) {
        return await mongo_client.connect(mongo_url).then(client => {
            const database = client.db("shop")
            return database.collection(collection).insertOne(record)
        })
    },

    update_record: async function(collection, id, record) {
        return await mongo_client.connect(mongo_url).then(client => {
            const database = client.db("shop")
            delete record._id
            return database.collection(collection).updateOne({"_id": id}, {$set: record})
        })
    },

    remove_record: async function(collection, id) {
        return await mongo_client.connect(mongo_url).then(client => {
            const database = client.db("shop")
            return database.collection(collection).deleteOne({"_id": id})
        })
    },

    get_client: async function () {
        return await mongo_client.connect(mongo_url)
    }
}

module.exports = mongo_functions