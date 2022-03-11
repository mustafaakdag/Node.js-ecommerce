const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
const { SendEMail } = require('./helpers/emailHelper');


const { Schema } = mongoose;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


mongoose.connect("mongodb+srv://userakademi:MQfSivTSQyWidFPR@cluster0.9orl8.mongodb.net/akademiecommerce?retryWrites=true&w=majority",{ useNewUrlParser: true })

const categorySchema = new Schema({
    name:String,
    description:String
})

const webUserSchema = new Schema({
    addDate: { type: Date, default: Date.now },
    email:String,
    password:String,
    address:[],
})

const productSchema = new Schema({
    name:String,
    price:Number,
    code:String,
    stockStatus: Boolean,
    // category: {type:categorySchema}
    // category:{}
    // categories:[],
    images : [],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
})

const orderSchema = new Schema({
    details:[],
    name: String,
    address: String,
    phone: String,
    orderCode: String
})


const categoryModel = mongoose.model('Category', categorySchema);
const productModel = mongoose.model('Product', productSchema);
const webUserModel = mongoose.model('Webuser', webUserSchema);
const orderModel = mongoose.model('Order', orderSchema);




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',function(req,res){
     res.json({name:'Iron Maiden'});
});


app.post('/order', (req,res) => {

    let randomOrderCode = Math.floor(Math.random() * 100000);

    var newOrder = orderModel({
        details : req.body.cart,
        name: req.body.name,
        address: req.body.address,
        phone : req.body.phone,
        ordercode: randomOrderCode
    })

    newOrder.save((err,doc) => {
        if(!err){

            let orderDetails = req.body.cart;

            let totalPrice = 0;
            orderDetails.forEach((item) => {
                totalPrice = totalPrice + (item.quantity * item.price)
            })

            var mailOptions = {
                from: 'bilgebatman19@gmail.com',
                to: req.body.email,
                subject: 'Sipariş Mail',
                text: totalPrice.toFixed(2) + " tutarındaki siparişiniz işleme alınmıştır. Sipariş kodunuz: " + randomOrderCode
              };

            SendEMail(mailOptions);
            res.json(doc);
        }
        else{
            res.status(500).json(err);
        }
    })

})

app.get('/product',async (req,res) => {

    var products = await productModel.find().populate("categories");

     res.json(products)
})

app.post('/product', (req,res) => {

    var newProduct = new productModel({
        name : req.body.name,
        price : req.body.price,
        categories : req.body.categories,
        code : req.body.code
    });

    newProduct.save((err,doc) => {
        if(!err){
            res.json(doc);
        }
        else{
            res.status(500).json(err);
        }
    })

})

app.delete('/product/:id', (req,res) => {

    let productId = req.params.id;

    productModel.findByIdAndDelete(productId,(err,doc) => {
        if(!err){
            res.json({})
        }
        else{
            res.status(500).json(err);
        }
    })

})

app.get('/category', function(req,res){

    categoryModel.find({},function (err,docs){
        
        if(!err){
            res.json(docs)
        }
        else{
            res.status(500).json(err)
        }
    })
  
});

app.get('/category/:id', function(req,res){

    let categoryId = req.params.id;
    let category = categories.find(q => q.id == categoryId);

    res.json(category);
});


app.post('/category', function(req,res){

    var newCategory = new categoryModel({
        name:req.body.name,
        description:req.body.description
    });

    newCategory.save(function(err,doc){
        if(!err){
            res.json(doc);
        }
        else{
            res.status(500).json(err);
        }
    })

})


app.delete('/category/:id', (req,res) => {

    let categoryId = req.params.id;

    console.log('category Id', categoryId);
    categoryModel.findByIdAndDelete(categoryId,(err,doc)=> {

        if(!err){
            res.json({});
        }
        else{
            res.status(500).json(err);
        }

    })

})



app.listen(3001);