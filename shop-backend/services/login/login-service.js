const dbOperations = require('../../mongo-operations')

async function login(email, password){
    // Get matching user from mongo
    const customer_result = await dbOperations.find_record("customers", email)
    // Validate password
    if (customer_result && customer_result.password == password){
        return customer_result
    }
    throw 'Bad Login'
}

module.exports = {login}