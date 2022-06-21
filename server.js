const express = require("express");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
var cors = require('cors');
server.use(cors());

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

server.use(body_parser.json({limit: '50mb'}));
server.use(body_parser.urlencoded({ limit: '50mb', extended: true }));

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "ytc";
const collectionName = "trend";
const collectionName2 = "state";

// << db init >>
db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

	// << db CRUD routes >>
	server.post("/items", (request, response) => {
		const item = request.body;


		const itemId = parseInt(request.body.id);
		console.log("POST item  id: ", typeof itemId);
		dbCollection.deleteOne({ id: itemId }, function(error, result) {
			console.log('error is...' + error +'..result is...' + result);
			if (error) throw error;
            
		});

		dbCollection.insertOne(item, (error, result) => { // callback of insertOne
			if (error) throw error;
			// return updated list
			dbCollection.find().toArray((_error, _result) => { // callback of find
				if (_error) throw _error;
				response.json(_result);
			});
		});
	});

	server.get("/items", (request, response) => {
		// return updated list
		dbCollection.find().toArray((error, result) => {
			if (error) throw error;
			response.json(result);
		});
	});

	server.get("/items/:id", (request, response) => {
		const itemId = parseInt(request.params.id);
		console.log("Get item with id: ", typeof itemId);
	
		dbCollection.findOne({ id: itemId }, (error, result) => {
			console.log("Get error with id: ", JSON.stringify(error));
			if (error) throw error;
			// return item
			response.json(result);
		});
	});

	server.delete("/items/:id", (request, response) => {
		const itemId = request.params.id;
		console.log("Delete item with id: ", itemId);
	
		dbCollection.deleteOne({ id: itemId }, function(error, result) {
			if (error) throw error;
			// send back entire updated list after successful request
			dbCollection.find().toArray(function(_error, _result) {
				if (_error) throw _error;
				response.json(_result);
			});
		});
	});

}, function(err) { // failureCallback
    throw (err);
});

db.initialize(dbName, collectionName2, function(dbCollection) { // successCallback
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

	// << db CRUD routes >>
	server.post("/state", (request, response) => {
		const item = request.body;

		const itemId = parseInt(request.body.id);
		console.log("POST state scrip  id: ", typeof itemId);
		dbCollection.deleteOne({ id: itemId }, function(error, result) {
			if (error) throw error;
		});

		dbCollection.insertOne(item, (error, result) => { // callback of insertOne
			if (error) throw error;
			// return updated list
			dbCollection.find().toArray((_error, _result) => { // callback of find
				if (_error) throw _error;
				response.json(_result);
			});
		});
	});

	server.get("/state", (request, response) => {
		// return updated list
		dbCollection.find().toArray((error, result) => {
			if (error) throw error;
			response.json(result);
		});
	});

	server.get("/state/:id", (request, response) => {
		// const itemId = request.params.id;
		const itemId = parseInt(request.params.id);
	
		dbCollection.findOne({ id: itemId }, (error, result) => {
			if (error) throw error;
			// return item
			response.json(result);
		});
	});

	server.delete("/state/:id", (request, response) => {
		const itemId = request.params.id;
		console.log("Delete state with id: ", itemId);
	
		dbCollection.deleteOne({ id: itemId }, function(error, result) {
			if (error) throw error;
			// send back entire updated list after successful request
			dbCollection.find().toArray(function(_error, _result) {
				if (_error) throw _error;
				response.json(_result);
			});
		});
	});



}, function(err) { // failureCallback
    throw (err);
});



server.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening at ${port}`);
});

server.on('clientError', (err, socket) => {
	console.error(err);
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
