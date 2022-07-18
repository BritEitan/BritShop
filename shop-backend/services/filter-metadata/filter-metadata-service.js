const dbOperations = require('../../mongo-operations')

// get the entire collection without filtering
async function get_collection(collection){
    return dbOperations.find_records(collection, [], 0, undefined)

}

module.exports = {get_collection}