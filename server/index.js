const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./Models/orders')
const OrderModel = require('./Models/orders')
// Flexible model for quick add-to-cart/testing (stores arbitrary payloads)
const SimpleOrder = mongoose.model('orders', new mongoose.Schema({}, { strict: false }));

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/kaaputale')

app.get('/get', (req, res) => {
    OrderModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// Accept arbitrary order payloads for development/testing and store them
app.post('/add', (req, res) => {
    const payload = req.body;
    const entry = new SimpleOrder(payload);
    entry.save()
      .then(doc => res.json(doc))
      .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () =>{
    console.log("Server is running") 
})