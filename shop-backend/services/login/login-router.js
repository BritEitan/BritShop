const express = require("express");
const {login} = require("./login-service");
const router = express.Router()

router.post('/', (req,res) => {
    login(req.body.email, req.body.password).then(result => res.send(result)).catch(e => res.status(401).send('Bad Login'))
})

module.exports = router