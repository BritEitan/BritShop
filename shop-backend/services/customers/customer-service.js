const dbOperations = require('../../mongo-operations')


async function get_customer(email){
    return dbOperations.find_record('customers', email)
}

async function create_customer(customer){
    if(customer.email &&
        customer.first_name
        && customer.last_name
        && customer.address
        && customer.password
        && customer.payment_method
        && customer.birth_date){
        customer._id = customer.email
        return dbOperations.create_record('customers', customer)
    }
    throw 'Bad Request'
}

async function update_customer(customer){
    if(customer.email &&
        customer.first_name
        && customer.last_name
        && customer.address
        && customer.payment_method
        && customer.password
        && customer.birth_date){
        return dbOperations.update_record('customers', customer.email,customer)
    }
    throw 'Bad Request'
}

module.exports = {create_customer, update_customer, get_customer}