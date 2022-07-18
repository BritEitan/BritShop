const express = require('express')
const bodyParser = require('body-parser')
const customer_router = require('./services/customers/customer-router')
const login_router = require('./services/login/login-router')
const metadata_router = require('./services/filter-metadata/filter-metadata-router')
const order_router = require('./services/order/order-router')
const product_router = require('./services/product/product-router')
const stats_router = require('./services/stats/stats-router')
const cors = require('cors')
const WebSocket = require('ws')
const {top_sellers} = require("./services/stats/stats-service");


const app = express()

// make available for any frontend
app.use(cors({ origin: true, credentials: true }));

app.options('*', cors())
const port = 3000

app.use(bodyParser.json())

// load service routers
app.use('/customers', customer_router)
app.use('/metadata', metadata_router)
app.use('/login', login_router)
app.use('/order', order_router)
app.use('/product', product_router)
app.use('/stats', stats_router)


let server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const wss = new WebSocket.Server({ server });

this.top_selling_item = {}

// update all websocket clients when top selling item changes
async function refreshTopSellingItem(wss){
    top_sellers().then(result => {
        if (!result[0].product_data[0]._id.equals(this.top_selling_item._id)){
            this.top_selling_item = result[0].product_data[0]
            wss.clients.forEach(function each(client) {
                client.send(JSON.stringify(this.top_selling_item));
            }.bind(this));
        }
    })
}
refreshTopSellingItem = refreshTopSellingItem.bind(this)

// check & update top selling item
setInterval(() => refreshTopSellingItem(wss), 5000)

wss.on('connection', ws => {
    ws.send(JSON.stringify(this.top_selling_item))
});
