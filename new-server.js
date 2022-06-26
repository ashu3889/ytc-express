const { MongoClient } = require("mongodb");
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

const uri = "mongodb+srv://ashu3889:amma2011@cluster0.uwkcv.mongodb.net/?retryWrites=true&w=majority";

server.post('/items', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ytc').collection('trend').deleteOne({ id: itemId });
    await client.db('ytc').collection('trend').insertOne(item);
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Data stored for ID .." + item,
      "user": item
    });
})

server.get('/items', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('ytc').collection('trend').find().toArray();
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Trend data obtained ",
      "user": users
    });
})

server.get('/items/:id', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    console.log('New server itemId is...' + itemId);
    const client = new MongoClient(uri);
    await client.connect();
    // await client.db('ytc').collection('trend').findOne({ id: itemId })
    const users = await client.db('ytc').collection('trend').findOne({ id: itemId });
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Trend data obtained for ID .." + 'res',
      "user": users
    });
})

server.post('/state', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ytc').collection('state').deleteOne({ id: itemId });
    await client.db('ytc').collection('state').insertOne(item);
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Data stored for ID .." + item,
      "user": item
    });
  })

server.get('/state', async(request, res) => {
    const item = request.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ytc').collection('state').find()
    const users = await client.db('ytc').collection('state').findOne().toArray();
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "State data obtained for .." ,
      "user": users
    });
})

server.get('/state/:id', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('ytc').collection('state').findOne({ id: itemId }).toArray();
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "State data stored for ID ..",
      "user": users
    });
})

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server listening at ${port}`);
});

server.on('clientError', (err, socket) => {
	console.error(err);
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});


// server.post("/items", (request, response) => {
//     const item = request.body;


//     const itemId = parseInt(request.body.id);
//     console.log("POST item  id: ", typeof itemId);
//     dbCollection.deleteOne({ id: itemId }, function(error, result) {
//         console.log('error is...' + error +'..result is...' + result);
//         if (error) throw error;
        
//     });

//     dbCollection.insertOne(item, (error, result) => { // callback of insertOne
//         if (error) throw error;
//         // return updated list
//         dbCollection.find().toArray((_error, _result) => { // callback of find
//             if (_error) throw _error;
//             response.json(_result);
//         });
//     });
// });