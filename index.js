const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('Mongodb').ObjectId;
const port = process.env.PORT || 5050;

//middleware
app.use(express.json())
app.use(cors());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cvfa5.mongodb.net/easyConstulting?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) =>{
	const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  	const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("review");
  	const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  	const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");

  	const handlePost = (route, collection) =>{
  		app.post(route, (req, res) =>{
  			collection.insertOne(data)
  			.then(result =>{
  				res.send(result.insertedCount > 0)
  			})
  		})
  	}
  	handlePost('/addService', serviceCollection)
  	handlePost('/addReview', reviewCollection)
  	handlePost('/addOrder', orderCollection)
  	handlePost('/addAdmin', adminCollection)

  	const handleGet = (route, collection, findobj={}) =>{
  		app.get(route, (req, res) =>{
  			collection.find(
  				findobj === 'email'? {email:req.query.email}:
  				findobj === 'id' ? {__id : ObjectId(req.params.id)}: null
  			)
  			.toArray((err, items) =>{
  				res.send(items)
  			})
  		})

  	}
  	handleGet('/services', serviceCollection);
  	handleGet('/reviews', reviewCollection);
  	handleGet('/orders', orderCollection);
  	handleGet('/bookingList', orderCollection, 'email');
  	handleGet('/admin', adminCollection, 'email');
  	handleGet('/userReview', reviewCollection, 'email');
  	handleGet('/userReview/:id', reviewCollection, 'id');

  	const hanldeUpdate =(route, collection) =>{
  		app.path(route, (req, res) =>{
  			collection.updateOne({__id:ObjectId(req.params.id)}, {
  				$set:req.body
  			})
  			.then(result=>{
  				res.send((result.modifiedCount > 0))
  			})
  		})
  	}
  	hanldeUpdate('/statusUpdata/:id', orderCollection);
  	hanldeUpdate('/updateReview/:id', reviewCollection);
  	hanldeUpdate('/updateService/:id', serviceCollection);

  	const handleDelete = (route, collection) =>{
  		app.delete(route, (res, req) =>{
  			collection.deleteOne({_id:ObjectId(req.params.id)})
  			.then(result=>{
  				res.send(result.deleteCount > 0)
  			})
  		})
  	}
  	handleDelete('/delete/:id', serviceCollection);
  	handleDelete('/deleteReview/:id', reviewCollection);
  	handleDelete('/deleteOrder/:id', orderCollection);

  	app.get('/', (req, res) =>{
			res.send('welcome to page')
			console.log("hellow worlde")
  	})

})

app.listen(process.env.PORT || port)