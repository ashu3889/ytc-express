const { MongoClient } = require("mongodb");

const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const cosine = require("cosine-similarity");

// import * as tf from '@tensorflow/tfjs-node';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import cosine from 'cosine-similarity';



const express = require("express");
const server = express();
const path = require('path');
// var memwatch = require('memwatch');

const { createCanvas } = require('canvas');
const fs = require('fs');




const body_parser = require("body-parser");

// parse JSON (application/json content-type)
var cors = require('cors');
server.use(cors());

// memwatch.on('leak', function(info) { 
// 	console.log('leak info is...' + info);
//  });

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

server.use(body_parser.json({limit: '50mb'}));
server.use(body_parser.urlencoded({ limit: '50mb', extended: true }));

const port = 4000;

// const uri = "mongodb+srv://ashu3889:amma2011@cluster0.uwkcv.mongodb.net/?retryWrites=true&w=majority";
// const uri2 = "mongodb+srv://kavita3889:amma2011@cluster0.gcx33.mongodb.net/?retryWrites=true&w=majority";
// const uri3 = "mongodb+srv://jyotsana0812:amma2011@cluster0.snc1z38.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb://localhost:23456";
const uri2 = "mongodb://localhost:23456/";
const uri3 = "mongodb://localhost:23456/";


server.post('/items', async(request, res) => {
    const item = request.body;
    const itemId = parseInt(request.params.id);
    const client = new MongoClient(uri);
    await client.connect();

    const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
    console.log('first item...before delete length is...' + dataLength);
    await client.db('ytc').collection('trend').deleteMany({ id: request.body.id });
    const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
    console.log('first item...after deleted Length is...' + afterDataLength);

    await client.db('ytc').collection('trend').insertOne(item);
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Data stored for ID .." + item,
      "user": item
    });
})

server.delete('/items', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('trend').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete....first item...before delete length is...' + dataLength);
  await client.db('ytc').collection('trend').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete....first item...after delete Length is...' + afterDataLength);


  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})

server.delete('/state', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('state').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete....first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('state').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete...first state...after delete Length is...' + afterDataLength);

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
    // await client.db('ytc').collection('state').deleteOne({ id: request.body.scripName });;

    const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
    console.log('first state...before delete length is...' + dataLength);
    await client.db('ytc').collection('state').deleteMany({ id: request.body.id });
    const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
    console.log('first state...after deleted Length is...' + afterDataLength);


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
    const users = await client.db('ytc').collection('state').findOne({ id: itemId });
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "State data stored for ID ..",
      "user": users
    });
})

server.post('/results', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  await client.db('ytc').collection('result').deleteOne({ id: request.body.scripName });;
  await client.db('ytc').collection('result').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/results', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  const users = await client.db('ytc').collection('result').find().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Result data obtained ",
    "user": users
  });
})

server.delete('/items2', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  // await client.db('ytc').collection('trend').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete...delete second item...before delete length is...' + dataLength);
  await client.db('ytc').collection('trend').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete...delete second item...after deleted Length is...' + afterDataLength);


  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})


server.post('/items2', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();

  const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('second items..before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
  await client.db('ytc').collection('trend').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('second items...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('trend').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/items2', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  const users = await client.db('ytc').collection('trend').find().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trend data obtained ",
    "user": users
  });
})

server.get('/items2/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  console.log('New server itemId is...' + itemId);
  const client = new MongoClient(uri2);
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

server.post('/state2', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();

  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('second state ..before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
  await client.db('ytc').collection('state').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('second state ...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('state').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.delete('/state2', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  // await client.db('ytc').collection('state').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Delete....second state item...before delete length is...' + dataLength);
  await client.db('ytc').collection('state').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Delete...second state item...after deleted Length is...' + afterDataLength);

  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})

server.get('/state2', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri2);
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

server.get('/state2/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri2);
  await client.connect();
  const users = await client.db('ytc').collection('state').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data stored for ID ..",
    "user": users
  });
})

server.get('/rowCount/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: itemId } ,{ limit: 100 } );
  console.log('Item length..' + dataLength + '..id...'+ itemId);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Item length .." + dataLength,
    "rowCount": dataLength
  });
})


server.delete('/items3', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  console.log('delete ...hello ...' + request.body.scripName);
  // await client.db('ytc').collection('trend').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete....third items...before delete length is...' + dataLength);
  await client.db('ytc').collection('trend').deleteMany({ id: request.body.scripName });
  const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete...third items...after deleted Length is...' + afterDataLength);

  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})


server.post('/items3', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();

  const dataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third items...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
  await client.db('ytc').collection('trend').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('trend').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third items...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('trend').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/items3', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();

  // client.db('ytc').collection('trend').createIndex( { "category": 1 } )
  const users = await client.db('ytc').collection('trend').find().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trend data obtained ",
    "user": users
  });
})

server.get('/items3/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  console.log('New server itemId is...' + itemId);
  const client = new MongoClient(uri3);
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

server.post('/state3', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();


  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third state...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
  await client.db('ytc').collection('state').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third state...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('state').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.delete('/state3', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  // await client.db('ytc').collection('state').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete....third state...before delete length is...' + dataLength);
  await client.db('ytc').collection('state').deleteMany({ id: request.body.scripName });
  const afterDataLength = await client.db('ytc').collection('state').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete...third state...after delete Length is...' + afterDataLength);

  // console.log('req param is...' + JSON.stringify(request.body.scripName));
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})

server.get('/state3', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri3);
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

server.get('/state3/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  const users = await client.db('ytc').collection('state').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data stored for ID ..",
    "user": users
  });
})

server.listen(process.env.PORT || 5500, () => {
    console.log(`Server listening at ${port}`);
});

server.on('clientError', (err, socket) => {
	console.error(err);
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.post('/ibstock', async(request, res) => {
  console.log('IBKR...request received...' + JSON.stringify(request.body));
  const item = request.body;
  // const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('ib_stock_info').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('ib_stock_info').countDocuments( { con_id: request.body.con_id } ,{ limit: 100 } );
  console.log('first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('ib_stock_info').deleteMany({ con_id: request.body.con_id });
  const afterDataLength = await client.db('ytc').collection('ib_stock_info').countDocuments( { con_id: request.body.con_id } ,{ limit: 100 } );
  console.log('first state...after deleted Length is...' + afterDataLength);


  await client.db('ytc').collection('ib_stock_info').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/ibstock', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('ytc').collection('ib_stock_info').find()
  let users = await client.db('ytc').collection('ib_stock_info').findOne();

  // if(users !== null) {
  //   users = users.toArray();
  // }
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data obtained for .." ,
    "user": users
  });
});

server.get('/ibstock/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  const users = await client.db('ytc').collection('ib_stock_info').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data stored for ID ..",
    "user": users
  });
})

server.post('/investing', async(request, res) => {
  console.log('IBKR...request received...' + JSON.stringify(request.body));
  const item = request.body;
  // const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('investing_stocks').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('investing_stocks').countDocuments( { ticker: request.body.ticker } ,{ limit: 100 } );
  console.log('first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('investing_stocks').deleteMany({ ticker: request.body.ticker });
  const afterDataLength = await client.db('ytc').collection('investing_stocks').countDocuments( { ticker: request.body.ticker } ,{ limit: 100 } );
  console.log('first state...after deleted Length is...' + afterDataLength);


  await client.db('ytc').collection('investing_stocks').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/investing', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('ytc').collection('investing_stocks').find()
  const users = await client.db('ytc').collection('investing_stocks').findOne().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data obtained for .." ,
    "user": users
  });
});


server.post('/ibkr_trade', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();


  const dataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third state...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
  await client.db('ytc').collection('investing_trade_management').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('Third state...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('investing_trade_management').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.delete('/ibkr_trade', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  // await client.db('ytc').collection('investing_trade_management').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete....third state...before delete length is...' + dataLength);
  await client.db('ytc').collection('investing_trade_management').deleteMany({ id: request.body.scripName });
  const afterDataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
  console.log('Delete...third state...after delete Length is...' + afterDataLength);

  // console.log('req param is...' + JSON.stringify(request.body.scripName));
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data deleted for ID .." + item,
    "user": item
  });
})

server.get('/ibkr_trade', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri3);
  await client.connect();
  await client.db('ytc').collection('investing_trade_management').find()
  const users = await client.db('ytc').collection('investing_trade_management').find(data, (err, res) => err ? reject(err) : res.toArray().then(x => resolve(x)))

  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trade data obtained for .." ,
    "user": users
  });
})

server.get('/ibkr_trade/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  const users = await client.db('ytc').collection('investing_trade_management').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trade data stored for ID ..",
    "user": users
  });
})



server.post('/new_items', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();

  const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first item...before delete length is...' + dataLength);
  await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first item...after deleted Length is...' + afterDataLength);

  await client.db('ytc').collection('trend_new').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.delete('/new_items', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('trend_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete....first item...before delete length is...' + dataLength);
await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete....first item...after delete Length is...' + afterDataLength);


await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})

server.delete('/new_state', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('state_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete....first state...before delete length is...' + dataLength);
await client.db('ytc').collection('state_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete...first state...after delete Length is...' + afterDataLength);

await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_items', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('ytc').collection('trend_new').find().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trend data obtained ",
    "user": users
  });
})

server.get('/new_items/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  console.log('New server itemId is...' + itemId);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('trend_new').findOne({ id: itemId })
  const users = await client.db('ytc').collection('trend_new').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trend data obtained for ID .." + 'res',
    "user": users
  });
})

server.post('/new_state', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('state_new').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('state_new').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first state...after deleted Length is...' + afterDataLength);


  await client.db('ytc').collection('state_new').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/new_state', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('ytc').collection('state_new').find()
  const users = await client.db('ytc').collection('state_new').findOne().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data obtained for .." ,
    "user": users
  });
})

server.get('/new_state/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('ytc').collection('state_new').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data stored for ID ..",
    "user": users
  });
})

server.post('/new_results', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
await client.db('ytc').collection('result').deleteOne({ id: request.body.scripName });;
await client.db('ytc').collection('result').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_results', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
const users = await client.db('ytc').collection('result').find().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Result data obtained ",
  "user": users
});
})

server.delete('/new_items2', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
// await client.db('ytc').collection('trend_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete...delete second item...before delete length is...' + dataLength);
await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete...delete second item...after deleted Length is...' + afterDataLength);


await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})


server.post('/new_items2', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();

const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('second items..before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('second items...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('trend_new').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_items2', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
const users = await client.db('ytc').collection('trend_new').find().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trend data obtained ",
  "user": users
});
})

server.get('/new_items2/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
console.log('New server itemId is...' + itemId);
const client = new MongoClient(uri2);
await client.connect();
// await client.db('ytc').collection('trend_new').findOne({ id: itemId })


const users = await client.db('ytc').collection('trend_new').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trend data obtained for ID .." + 'res',
  "user": users
});
})

server.post('/new_state2', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();

const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('second state ..before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
await client.db('ytc').collection('state_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('second state ...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('state_new').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.delete('/new_state2', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
// await client.db('ytc').collection('state_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Delete....second state item...before delete length is...' + dataLength);
await client.db('ytc').collection('state_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Delete...second state item...after deleted Length is...' + afterDataLength);

await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})

server.get('/new_state2', async(request, res) => {
const item = request.body;
const client = new MongoClient(uri2);
await client.connect();
await client.db('ytc').collection('state_new').find()
const users = await client.db('ytc').collection('state_new').findOne().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data obtained for .." ,
  "user": users
});
})

server.get('/new_state2/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri2);
await client.connect();
const users = await client.db('ytc').collection('state_new').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data stored for ID ..",
  "user": users
});
})

server.get('/new_rowCount/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: itemId } ,{ limit: 100 } );
console.log('Item length..' + dataLength + '..id...'+ itemId);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Item length .." + dataLength,
  "rowCount": dataLength
});
})


server.delete('/new_items3', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
console.log('delete ...hello ...' + request.body.scripName);
// await client.db('ytc').collection('trend_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete....third items...before delete length is...' + dataLength);
await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.scripName });
const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete...third items...after deleted Length is...' + afterDataLength);

await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})


server.post('/new_items3', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();

const dataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third items...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
await client.db('ytc').collection('trend_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third items...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('trend_new').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_items3', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();

// client.db('ytc').collection('trend_new').createIndex( { "category": 1 } )
const users = await client.db('ytc').collection('trend_new').find().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trend data obtained ",
  "user": users
});
})

server.get('/new_items3/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
console.log('New server itemId is...' + itemId);
const client = new MongoClient(uri3);
await client.connect();
// await client.db('ytc').collection('trend_new').findOne({ id: itemId })
const users = await client.db('ytc').collection('trend_new').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trend data obtained for ID .." + 'res',
  "user": users
});
})

server.post('/new_state3', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();


const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third state...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
await client.db('ytc').collection('state_new').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third state...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('state_new').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.delete('/new_state3', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
// await client.db('ytc').collection('state_new').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete....third state...before delete length is...' + dataLength);
await client.db('ytc').collection('state_new').deleteMany({ id: request.body.scripName });
const afterDataLength = await client.db('ytc').collection('state_new').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete...third state...after delete Length is...' + afterDataLength);

// console.log('req param is...' + JSON.stringify(request.body.scripName));
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})

server.get('/new_state3', async(request, res) => {
const item = request.body;
const client = new MongoClient(uri3);
await client.connect();
await client.db('ytc').collection('state_new').find()
const users = await client.db('ytc').collection('state_new').findOne().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data obtained for .." ,
  "user": users
});
})

server.get('/new_state3/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
const users = await client.db('ytc').collection('state_new').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data stored for ID ..",
  "user": users
});
})



server.post('/new_ibstock', async(request, res) => {
console.log('IBKR...request received...' + JSON.stringify(request.body));
const item = request.body;
// const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('ib_stock_info').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('ib_stock_info').countDocuments( { con_id: request.body.con_id } ,{ limit: 100 } );
console.log('first state...before delete length is...' + dataLength);
await client.db('ytc').collection('ib_stock_info').deleteMany({ con_id: request.body.con_id });
const afterDataLength = await client.db('ytc').collection('ib_stock_info').countDocuments( { con_id: request.body.con_id } ,{ limit: 100 } );
console.log('first state...after deleted Length is...' + afterDataLength);


await client.db('ytc').collection('ib_stock_info').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_ibstock', async(request, res) => {
const item = request.body;
const client = new MongoClient(uri);
await client.connect();
await client.db('ytc').collection('ib_stock_info').find()
let users = await client.db('ytc').collection('ib_stock_info').findOne();

// if(users !== null) {
//   users = users.toArray();
// }
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data obtained for .." ,
  "user": users
});
});

server.get('/new_ibstock/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
const users = await client.db('ytc').collection('ib_stock_info').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data stored for ID ..",
  "user": users
});
})

server.post('/new_investing', async(request, res) => {
console.log('IBKR...request received...' + JSON.stringify(request.body));
const item = request.body;
// const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('investing_stocks').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('investing_stocks').countDocuments( { ticker: request.body.ticker } ,{ limit: 100 } );
console.log('first state...before delete length is...' + dataLength);
await client.db('ytc').collection('investing_stocks').deleteMany({ ticker: request.body.ticker });
const afterDataLength = await client.db('ytc').collection('investing_stocks').countDocuments( { ticker: request.body.ticker } ,{ limit: 100 } );
console.log('first state...after deleted Length is...' + afterDataLength);


await client.db('ytc').collection('investing_stocks').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.get('/new_investing', async(request, res) => {
const item = request.body;
const client = new MongoClient(uri);
await client.connect();
await client.db('ytc').collection('investing_stocks').find()
const users = await client.db('ytc').collection('investing_stocks').findOne().toArray();
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "State data obtained for .." ,
  "user": users
});
});


server.post('/new_ibkr_trade', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();


const dataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third state...before delete length is...' + dataLength + '...request.body.id...' + request.body.id + '...itemId...' + itemId);
await client.db('ytc').collection('investing_trade_management').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('Third state...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('investing_trade_management').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.delete('/new_ibkr_trade', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
// await client.db('ytc').collection('investing_trade_management').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete....third state...before delete length is...' + dataLength);
await client.db('ytc').collection('investing_trade_management').deleteMany({ id: request.body.scripName });
const afterDataLength = await client.db('ytc').collection('investing_trade_management').countDocuments( { id: request.body.scripName } ,{ limit: 100 } );
console.log('Delete...third state...after delete Length is...' + afterDataLength);

// console.log('req param is...' + JSON.stringify(request.body.scripName));
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})

server.get('/new_ibkr_trade', async(request, res) => {
const item = request.body;
const client = new MongoClient(uri3);
await client.connect();
await client.db('ytc').collection('investing_trade_management').find()
const users = await client.db('ytc').collection('investing_trade_management').find(data, (err, res) => err ? reject(err) : res.toArray().then(x => resolve(x)))

await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trade data obtained for .." ,
  "user": users
});
})

server.get('/new_ibkr_trade/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri3);
await client.connect();
const users = await client.db('ytc').collection('investing_trade_management').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trade data stored for ID ..",
  "user": users
});
})

server.post('/state_weekness', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('state_weekness').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('state_weekness').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('first state...after deleted Length is...' + afterDataLength);


  await client.db('ytc').collection('state_weekness').insertOne(item);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
})

server.get('/state_weekness', async(request, res) => {
  const item = request.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('ytc').collection('state_weekness').find()
  const users = await client.db('ytc').collection('state_weekness').findOne().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data obtained for .." ,
    "user": users
  });
});

server.delete('/state_weekness', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  // await client.db('ytc').collection('state_weekness').deleteOne({ id: request.body.scripName });;

  const dataLength = await client.db('ytc').collection('state_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete....first state...before delete length is...' + dataLength);
  await client.db('ytc').collection('state_weekness').deleteMany({ id: request.body.id });
  const afterDataLength = await client.db('ytc').collection('state_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
  console.log('ALL Delete...first state...after delete Length is...' + afterDataLength);

  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Data stored for ID .." + item,
    "user": item
  });
});

server.get('/state_weekness/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('ytc').collection('state_weekness').findOne({ id: itemId });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "State data stored for ID ..",
    "user": users
  });
})

server.get('/items_weekness', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('ytc').collection('trend_weekness').find().toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Trend data obtained ",
    "user": users
  });
});

server.post('/items_weekness', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();

const dataLength = await client.db('ytc').collection('trend_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('first item...before delete length is...' + dataLength);
await client.db('ytc').collection('trend_weekness').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('first item...after deleted Length is...' + afterDataLength);

await client.db('ytc').collection('trend_weekness').insertOne(item);
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data stored for ID .." + item,
  "user": item
});
})

server.delete('/items_weekness', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('trend_weekness').deleteOne({ id: request.body.scripName });;

const dataLength = await client.db('ytc').collection('trend_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete....first item...before delete length is...' + dataLength);
await client.db('ytc').collection('trend_weekness').deleteMany({ id: request.body.id });
const afterDataLength = await client.db('ytc').collection('trend_weekness').countDocuments( { id: request.body.id } ,{ limit: 100 } );
console.log('ALL Delete....first item...after delete Length is...' + afterDataLength);


await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Data deleted for ID .." + item,
  "user": item
});
})

server.get('/items_weekness/:id', async(request, res) => {
const item = request.body;
const itemId = parseInt(request.params.id);
console.log('New server itemId is...' + itemId);
const client = new MongoClient(uri);
await client.connect();
// await client.db('ytc').collection('trend_weekness').findOne({ id: itemId })
const users = await client.db('ytc').collection('trend_weekness').findOne({ id: itemId });
await client.close();
res.status(200).send({
  "status": "ok",
  "message": "Trend data obtained for ID .." + 'res',
  "user": users
});
})


server.get('/rowCount_weekness/:id', async(request, res) => {
  const item = request.body;
  const itemId = parseInt(request.params.id);
  const client = new MongoClient(uri3);
  await client.connect();
  const dataLength = await client.db('ytc').collection('state_weekness').countDocuments( { id: itemId } ,{ limit: 100 } );
  console.log('Item length..' + dataLength + '..id...'+ itemId);
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Item length .." + dataLength,
    "rowCount": dataLength
  });
});


/**
 * HELPER: Map Data to Pixels
 */
function getPixelCoords(target, allData) {
  const { width, height, padding } = CHART_CONFIG;
  
  const index = allData.findIndex(d => {
      // console.log("-------");
      // console.log('A...' +  new Date(d.date).getTime());
      // console.log('B...' +  new Date(target.timestamp).getTime());
      // console.log("-------");

      return new Date(d.date).getTime() === new Date(target.timestamp).getTime();
    }
  );
  if (index === -1) return null;

  const chartWidth = width - (padding * 2);
  const x = padding + (index * (chartWidth / (allData.length - 1)));

  const highs = allData.map(d => d.high);
  const lows = allData.map(d => d.low);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  
  const chartHeight = height - (padding * 2);
  const y = height - padding - ((target.price - minP) / (maxP - minP)) * chartHeight;

  return { x: Math.round(x), y: Math.round(y) };
}

const STORAGE_DIR = path.join(__dirname, 'ohlc_storage');

const NOISE_WEAKENSS_TRAIN_STORAGE_DIR = path.join(__dirname, 'cnn/train/noise');
const WEAKENSS_TRAIN_STORAGE_DIR = path.join(__dirname, 'cnn/train/correct');


if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

// Config constants to ensure coordinate consistency
const CHART_CONFIG = {
    width: 900,
    height: 500,
    padding: 60,
    bgColor: '#ffffff',
    gridColor: '#e0e3eb',
    axisColor: '#8a8a8a',
    textColor: '#131722'
};

/**
* DRAWING LOGIC
*/


// function drawChart(data, symbol, maskCoords = null) {
//   const { width, height, padding } = CHART_CONFIG;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext('2d');

//   // Background
//   ctx.fillStyle = CHART_CONFIG.bgColor;
//   ctx.fillRect(0, 0, width, height);

//   const highs = data.map(d => d.high);
//   const lows = data.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = maxP - minP;

//   const getX = (i) => padding + (i * ((width - padding * 2) / (data.length - 1)));
//   const getY = (p) => height - padding - ((p - minP) / range) * (height - padding * 2);

//   // Draw Candles
//   data.forEach((d, i) => {
//       const x = getX(i);
//       const color = d.close >= d.open ? '#089981' : '#f23645';
//       const candleWidth = ((width - padding * 2) / data.length) * 0.7;

//       ctx.strokeStyle = color;
//       ctx.beginPath();
//       ctx.moveTo(x, getY(d.high));
//       ctx.lineTo(x, getY(d.low));
//       ctx.stroke();

//       ctx.fillStyle = color;
//       const bodyTop = getY(Math.max(d.open, d.close));
//       const bodyBottom = getY(Math.min(d.open, d.close));
//       ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // Apply Mask for Visual RAG
//   if (maskCoords) {
//       const size = 40;
//       ctx.fillStyle = 'black';
//       ctx.fillRect(maskCoords.x - size / 2, maskCoords.y - size / 2, size, size);
//       ctx.fillStyle = 'white';
//       ctx.font = '8px Arial';
//       ctx.fillText('MASK', maskCoords.x - 12, maskCoords.y + 3);
//   }

//   return canvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. CALCULATE BOUNDS TO INCLUDE ALL MARKERS
//   // We find the earliest and latest points we care about

//   const { width, height, padding } = CHART_CONFIG;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext('2d');

//   // Background
//   ctx.fillStyle = CHART_CONFIG.bgColor;
//   ctx.fillRect(0, 0, width, height);

  
//   const minIdx = Math.min(highIndex, lowIndex, uptrendStartIndex);
//   const maxIdx = Math.max(highIndex, lowIndex, uptrendStartIndex);
  
//   const buffer = 10;
//   const startIdx = Math.max(0, minIdx - buffer);
//   // Add extra room on the right (20 bars) for the "UPTREND" label
//   const endIdx = Math.min(data.length - 1, maxIdx + 20);
  
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. RESET & SETUP CANVAS
//   ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

//   // 3. SCALING ENGINE (Local to this data slice)
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = (maxP - minP) || 1;

//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     // (visibleData.length) ensures the last candle isn't stuck to the very edge
//     return CONFIG.padding + (relativeIdx * ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length)));
//   };

//   const getY = (p) => {
//     return CONFIG.height - CONFIG.padding - ((p - minP) / range) * (CONFIG.height - CONFIG.padding * 2);
//   };

//   // 4. DRAW CANDLESTICKS
//   const candleWidth = ((CONFIG.width - CONFIG.padding * 2) / visibleData.length) * 0.7;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 1;
//     ctx.beginPath(); 
//     ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low)); 
//     ctx.stroke();
    
//     ctx.fillStyle = color;
//     const bodyTop = getY(Math.max(d.open, d.close));
//     const bodyBottom = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // 5. DRAW THE RED DESCENDING LINE
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 6. DRAW UPTREND MARKER (Arrow + Text)
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);

//   ctx.fillStyle = '#008000'; // Dark Green
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 8, upY + 25);
//   ctx.lineTo(upX + 8, upY + 25);
//   ctx.fill();

//   ctx.fillStyle = '#000000'; // Black text for white background
//   ctx.font = 'bold 12px Arial';
//   ctx.fillText('UPTREND', upX - 25, upY + 40);

//   return sharedCanvas.toBuffer('image/png');
// }




// Ensure these exist even if CONFIG is missing elsewhere
const chartWidth = 800;
const chartHeight = 400;
const padding = 50;


const sharedCanvas = createCanvas(chartWidth, chartHeight);
const ctx = sharedCanvas.getContext('2d');


function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
  // 1. DYNAMIC CROP: Start exactly at the uptrend to remove prior noise
  const startIdx = uptrendStartIndex;
  const endIdx = Math.min(data.length - 1, lowIndex + 12); // Context after the low
  const visibleData = data.slice(startIdx, endIdx + 1);

  // 2. VERTICAL NORMALIZATION: Tight zoom on the Valley
  const highs = visibleData.map(d => d.high);
  const lows = visibleData.map(d => d.low);
  let maxP = Math.max(...highs);
  let minP = Math.min(...lows);
  
  // 8% padding ensures the peak and base aren't cut off by the canvas edge
  const priceRange = (maxP - minP) || 1;
  maxP += priceRange * 0.08;
  minP -= priceRange * 0.08;

  // Scaling helpers
  const getX = (i) => padding + ((i - startIdx) * ((chartWidth - padding * 2) / (visibleData.length - 1)));
  const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

  // 3. RENDER BACKGROUND & BASELINE
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, chartWidth, chartHeight);
  
  // The "Zero Plane": Teal line marks the support level of the uptrend start
  const baseY = getY(data[uptrendStartIndex].low);
  ctx.strokeStyle = 'rgba(0, 161, 161, 0.4)';
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, baseY); ctx.lineTo(chartWidth - padding, baseY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset for other lines

  // 4. THE CONTEXT SKELETON: Uptrend Vector
  // Muted color so the AI treats this as the "baseline effort"
  ctx.strokeStyle = 'rgba(8, 153, 129, 0.4)'; 
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(getX(uptrendStartIndex), getY(data[uptrendStartIndex].low));
  ctx.lineTo(getX(highIndex), getY(data[highIndex].high));
  ctx.stroke();

  // 5. DRAW CANDLESTICKS (All visible for full context)
  const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.75;
  visibleData.forEach((d, i) => {
    const x = getX(startIdx + i);
    const color = d.close >= d.open ? '#089981' : '#f23645';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
    ctx.stroke();

    ctx.fillStyle = color;
    const t = getY(Math.max(d.open, d.close));
    const b = getY(Math.min(d.open, d.close));
    ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
  });

  // 6. THE PRIMARY FEATURE: THE DESCENDING WEAKNESS
  // Thickest and highest contrast line for the RAG Vision model
  ctx.strokeStyle = '#f23645';
  ctx.lineWidth = 6; 
  ctx.beginPath();
  ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
  ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
  ctx.stroke();

  // 7. ANNOTATION
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('▲ UPTREND START', getX(uptrendStartIndex), baseY + 25);

  return sharedCanvas.toBuffer('image/png');
}

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. WINDOW SETUP (Same as before)
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 15);
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. SCALING (Standard)
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
//   const priceRange = (maxP - minP) * 0.1;
//   maxP += priceRange; minP -= priceRange;

//   const getX = (i) => padding + ((i - startIdx) * ((chartWidth - padding * 2) / (visibleData.length - 1)));
//   const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

//   // 3. BACKGROUND: HORIZONTAL BASELINE
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);
  
//   const baseY = getY(data[uptrendStartIndex].low);
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.3)'; 
//   ctx.setLineDash([5, 5]);
//   ctx.beginPath();
//   ctx.moveTo(padding, baseY); ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]);

//   // 4. THE CONTEXT: UPTREND LINE (Thin/Green)
//   // This preserves the 'how we got here' context for the RAG
//   ctx.strokeStyle = 'rgba(8, 153, 129, 0.5)'; // Muted Green
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(getX(uptrendStartIndex), getY(data[uptrendStartIndex].low));
//   ctx.lineTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.stroke();

//   // 5. DRAW ALL CANDLESTICKS (Keep them 100% visible but thin)
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.7;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     ctx.fillStyle = color;
//     const t = getY(Math.max(d.open, d.close));
//     const b = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1));
//   });

//   // 6. THE FOCUS: DESCENDING WEAKNESS (Thick/Red)
//   // This is the primary signal for the RAG
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 5; 
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   return sharedCanvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC HORIZONTAL RANGE (Chronological)
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 15); // Extra padding to see support
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. VERTICAL ZOOM
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   // Add 10% vertical padding
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.1;
//   minP -= priceRange * 0.1;

//   // 3. SCALING HELPERS
//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     return padding + (relativeIdx * ((chartWidth - padding * 2) / (visibleData.length - 1)));
//   };
//   const getY = (p) => {
//     return chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);
//   };

//   // 4. DRAWING
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);

//   // --- NEW: DRAW THE HORIZONTAL BASELINE ---
//   // We draw this first so it appears "behind" the candles
//   const basePrice = data[lowIndex].low;
//   const baseY = getY(basePrice);
  
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.4)'; // Teal/Cyan with transparency
//   ctx.lineWidth = 2;
//   ctx.setLineDash([10, 5]); // Create a dashed effect
//   ctx.beginPath();
//   ctx.moveTo(padding, baseY);
//   ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]); // Reset line dash for subsequent drawing

//   // 5. DRAW CANDLESTICKS
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.7;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     ctx.fillStyle = color;
//     const t = getY(Math.max(d.open, d.close));
//     const b = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1));
//   });

//   // 6. DRAW THE DESCENDING WEAKNESS LINE (High to Low)
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 4;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. START MARKER
//   const upX = getX(uptrendStartIndex);
//   ctx.fillStyle = '#000000';
//   ctx.beginPath();
//   ctx.moveTo(upX, getY(data[uptrendStartIndex].low) + 5);
//   ctx.lineTo(upX - 8, getY(data[uptrendStartIndex].low) + 20);
//   ctx.lineTo(upX + 8, getY(data[uptrendStartIndex].low) + 20);
//   ctx.fill();
//   ctx.font = 'bold 12px Arial';
//   ctx.fillText('UPTREND START', upX, getY(data[uptrendStartIndex].low) + 35);

//   return sharedCanvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. STRICT CHRONOLOGICAL WINDOW
//   // Start exactly at the uptrend. End just after the low.
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 10); // Small buffer after the low
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. PEAK-TO-VALLEY VERTICAL ZOOM
//   // We want the 'High' to be near the top and 'Low' near the bottom
//   const visibleHighs = visibleData.map(d => d.high);
//   const visibleLows = visibleData.map(d => d.low);
  
//   let maxP = Math.max(...visibleHighs);
//   let minP = Math.min(...visibleLows);
  
//   // Apply a 5% margin so the red line doesn't touch the canvas edge
//   const paddingBuffer = (maxP - minP) * 0.05;
//   maxP += paddingBuffer;
//   minP -= paddingBuffer;

//   // 3. SCALING ENGINE
//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     return padding + (relativeIdx * ((chartWidth - padding * 2) / (visibleData.length - 1)));
//   };

//   const getY = (p) => {
//     return chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);
//   };

//   // 4. DRAWING PREP
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);

//   // 5. DRAW CANDLESTICKS
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.7;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     ctx.fillStyle = color;
//     const t = getY(Math.max(d.open, d.close));
//     const b = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1));
//   });

//   // 6. RAG FEATURE: THE DESCENDING WEAKNESS LINE
//   // This is what the vision model will use to calculate 'Weakness'
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 4; // Bold for RAG identification
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. LABELS (For model context)
//   ctx.fillStyle = '#000000';
//   ctx.font = 'bold 12px Arial';
  
//   // Marker at Start
//   const upX = getX(uptrendStartIndex);
//   ctx.beginPath();
//   ctx.moveTo(upX, getY(data[uptrendStartIndex].low) + 5);
//   ctx.lineTo(upX - 6, getY(data[uptrendStartIndex].low) + 15);
//   ctx.lineTo(upX + 6, getY(data[uptrendStartIndex].low) + 15);
//   ctx.fill();
//   ctx.fillText('START', upX - 15, getY(data[uptrendStartIndex].low) + 25);

//   return sharedCanvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC HORIZONTAL RANGE
//   // We start exactly where the uptrend begins
//   const startIdx = uptrendStartIndex; 
  
//   // We end a few candles after the Low to see the support/rejection
//   const endIdx = Math.min(data.length - 1, lowIndex + 10);
  
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. DYNAMIC VERTICAL ZOOM (Based on OHLC within the Valley)
//   // We find the highest point (at highIndex) and lowest point (at lowIndex)
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
  
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   // Add 10% vertical padding so the wicks don't touch the edges
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.10;
//   minP -= priceRange * 0.10;

//   // 3. SCALING ENGINE
//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     const drawWidth = chartWidth - (padding * 2);
//     return padding + (relativeIdx * (drawWidth / Math.max(1, visibleData.length - 1)));
//   };

//   const getY = (p) => {
//     const drawHeight = chartHeight - (padding * 2);
//     return chartHeight - padding - ((p - minP) / (maxP - minP)) * drawHeight;
//   };

//   // 4. RESET CANVAS
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);

//   // 5. DRAW CANDLESTICKS
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.7;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
    
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     ctx.fillStyle = color;
//     const t = getY(Math.max(d.open, d.close));
//     const b = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1));
//   });

//   // 6. DRAW THE VALLEY PATTERN (Red Line from High to Low)
//   // Since High comes after Start, and Low comes last, this draws the drop.
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. DRAW START MARKER (Uptrend Start)
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);
  
//   ctx.fillStyle = '#000000';
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 8, upY + 25);
//   ctx.lineTo(upX + 8, upY + 25);
//   ctx.fill();

//   ctx.font = 'bold 12px Arial';
//   ctx.fillText('UPTREND START', upX, upY + 40);

//   return sharedCanvas.toBuffer('image/png');
// }
// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. TIGHT CROP LOGIC
//   // We only care about the sequence: High -> Low -> Uptrend Start
//   const startIdx = Math.max(0, highIndex - 5); // 5 candles before the high
//   const endIdx = Math.min(data.length - 1, uptrendStartIndex + 10); // 10 candles after the signal
  
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. RE-CALCULATE SCALING FOR THE CROP
//   // This ensures the candles fill the vertical space of the image
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = (maxP - minP) || 1;

//   // 3. DRAWING HELPERS
//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     // We use a small horizontal padding so candles aren't touching the walls
//     const innerWidth = chartWidth - (padding * 2);
//     return padding + (relativeIdx * (innerWidth / Math.max(1, visibleData.length - 1)));
//   };

//   const getY = (p) => {
//     const innerHeight = chartHeight - (padding * 2);
//     return chartHeight - padding - ((p - minP) / range) * innerHeight;
//   };

//   // 4. RE-RENDER (Candles, Red Line, Signal)
//   ctx.clearRect(0, 0, chartWidth, chartHeight);
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);

//   const candleWidth = (chartWidth / visibleData.length) * 0.6;

//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
    
//     // Wick
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high));
//     ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     // Body
//     ctx.fillStyle = color;
//     const top = getY(Math.max(d.open, d.close));
//     const bottom = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, top, candleWidth, Math.max(bottom - top, 1));
//   });

//   // 5. RED TREND LINE
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 6. SIGNAL MARKER
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);
  
//   ctx.fillStyle = '#000';
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 8, upY + 22);
//   ctx.lineTo(upX + 8, upY + 22);
//   ctx.fill();
//   ctx.font = 'bold 14px Arial';
//   ctx.fillText('SIGNAL', upX - 25, upY + 35);

//   return sharedCanvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // --- DEBUGGING: Check your inputs in the console ---
//   console.log(`Drawing ${symbol}: HighIdx=${highIndex}, LowIdx=${lowIndex}, UpIdx=${uptrendStartIndex}`);
  
//   if (!data || data.length === 0) {
//     console.error("Error: No data provided to chart function");
//     return null;
//   }

//   // 1. CALCULATE BOUNDS
//   const minIdx = Math.min(highIndex, lowIndex, uptrendStartIndex);
//   const maxIdx = Math.max(highIndex, lowIndex, uptrendStartIndex);
//   const startIdx = Math.max(0, minIdx - 10);
//   const endIdx = Math.min(data.length - 1, maxIdx + 20);
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. SETUP CANVAS
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);

//   // 3. SCALING ENGINE
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = (maxP - minP) || 1;

//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     return padding + (relativeIdx * ((chartWidth - padding * 2) / (visibleData.length + 5)));
//   };

//   const getY = (p) => {
//     return chartHeight - padding - ((p - minP) / range) * (chartHeight - padding * 2);
//   };

//   // 4. DRAW CANDLESTICKS
//   const candleWidth = Math.max(2, ((chartWidth - padding * 2) / (visibleData.length + 5)) * 0.7);
  
//   visibleData.forEach((d, i) => {
//     const currentGlobalIdx = startIdx + i;
//     const x = getX(currentGlobalIdx);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
    
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(x, getY(d.high));
//     ctx.lineTo(x, getY(d.low));
//     ctx.stroke();

//     ctx.fillStyle = color;
//     const bodyTop = getY(Math.max(d.open, d.close));
//     const bodyBottom = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // 5. DRAW THE SIGNAL LINE (Red)
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 6. DRAW UPTREND MARKER (Arrow + Text)
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);

//   ctx.fillStyle = '#000000'; // Set to Black for visibility
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 10, upY + 25);
//   ctx.lineTo(upX + 10, upY + 25);
//   ctx.fill();

//   ctx.font = 'bold 16px Arial';
//   ctx.fillText('SIGNAL HERE', upX - 40, upY + 45);

//   return sharedCanvas.toBuffer('image/png');
// }

/**
* API ENDPOINT
*/
server.post('/api/generate-rag-chart', (req, res) => {
  const { symbol, ohlcData, maskTarget } = req.body;

  if (!ohlcData || ohlcData.length < 2) {
      return res.status(400).json({ error: "Insufficient OHLC data." });
  }

  // 1. Calculate Mask Coordinates
  let coords = null;
  if (maskTarget) {
    coords = getPixelCoords(maskTarget, ohlcData);
  }

  console.log('coords...' + JSON.stringify(coords));

  // 2. Generate Image
  const buffer = drawChart(ohlcData, symbol, coords);
  
  
  // 3. Save Locally
  const fileName = `${symbol || 'chart'}_${Date.now()}.png`;
  const filePath = path.join(STORAGE_DIR, fileName);
  fs.writeFileSync(filePath, buffer);

  // 4. Return Data
  res.json({
      success: true,
      pixelCoordinates: coords,
      imageName: fileName,
      localPath: filePath,
      viewUrl: `http://localhost:3000/images/${fileName}`
  });
});

const CONFIG = {
  width: 900,
  height: 500,
  padding: 70,
  spotlightSize: 140
};

// const sharedCanvas = createCanvas(CONFIG.width, CONFIG.height);
// const ctx = sharedCanvas.getContext('2d')


/**
* CORE: drawValidationChart
* Renders the candles, the trendline, the support base, and the spotlight.
*/
// function drawValidationChart(data, symbol, highIndex, lowIndex) {
//   // 1. Determine the "Zoom" Range
//   // We add a small buffer (e.g., 5 candles) so the start/end aren't touching the edges
//   const buffer = 5;
//   const startIdx = Math.max(0, highIndex - buffer);
//   const endIdx = Math.min(data.length - 1, lowIndex + buffer);
//   const visibleData = data.slice(startIdx, endIdx);

//   const canvas = createCanvas(CONFIG.width, CONFIG.height);
//   const ctx = canvas.getContext('2d');

//   // White Background
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

//   // 2. Calculate Scales based ONLY on the visible slice
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = maxP - minP || 1;

//   // Mapping functions localized to the zoom window
//   const getX = (i) => {
//       // i is the global index; we map its relative position in the slice
//       const relativeIdx = i - startIdx;
//       return CONFIG.padding + (relativeIdx * ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length - 1)));
//   };
//   const getY = (p) => CONFIG.height - CONFIG.padding - ((p - minP) / range) * (CONFIG.height - CONFIG.padding * 2);

//   // 3. Draw the Magnified Candles
//   visibleData.forEach((d, i) => {
//       const globalIdx = startIdx + i;
//       const x = getX(globalIdx);
//       const color = d.close >= d.open ? '#089981' : '#f23645';
//       const candleWidth = ((CONFIG.width - CONFIG.padding * 2) / visibleData.length) * 0.7;
      
//       ctx.strokeStyle = color;
//       ctx.lineWidth = 1;
//       ctx.beginPath(); ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low)); ctx.stroke();
      
//       ctx.fillStyle = color;
//       const bodyTop = getY(Math.max(d.open, d.close));
//       const bodyBottom = getY(Math.min(d.open, d.close));
//       ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // 4. Draw Prominent Validation Lines
//   const highCoords = { x: getX(highIndex), y: getY(data[highIndex].high) };
//   const lowCoords = { x: getX(lowIndex), y: getY(data[lowIndex].low) };

//   // Support Baseline (Teal) - Now spans the zoomed window
//   ctx.strokeStyle = '#00a1a1';
//   ctx.lineWidth = 3; // Thicker for RAG detection
//   ctx.beginPath();
//   ctx.moveTo(CONFIG.padding, lowCoords.y);
//   ctx.lineTo(CONFIG.width - CONFIG.padding, lowCoords.y);
//   ctx.stroke();

//   // Descending Trendline (Red)
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(highCoords.x, highCoords.y);
//   ctx.lineTo(lowCoords.x, lowCoords.y);
//   ctx.stroke();

//   // Markers
//   ctx.fillStyle = '#ffffff';
//   ctx.strokeStyle = '#333';
//   [highCoords, lowCoords].forEach(c => {
//       ctx.beginPath(); ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
//       ctx.fill(); ctx.stroke();
//   });

//   return canvas.toBuffer('image/png');
// }

/**
 * Professional AI Chart Visualizer (Gold Standard Version)
 * Highlights: Weakness (Downtrend), Support, and Precise Uptrend Start.
 */
// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC ZOOM: We center the view between the high and the uptrend start
//   const buffer = 10;
//   const startIdx = Math.max(0, highIndex - buffer);
//   // We extend the end slightly past the uptrend start to show the follow-through
//   const endIdx = Math.min(data.length - 1, Math.max(lowIndex, uptrendStartIndex) + buffer);
//   const visibleData = data.slice(startIdx, endIdx);

//   const canvas = createCanvas(CONFIG.width, CONFIG.height);
//   const ctx = canvas.getContext('2d');

//   // Background: Deep charcoal for high-contrast AI feature detection
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

//   // 2. SCALING ENGINE
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = (maxP - minP) || 1;

//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     return CONFIG.padding + (relativeIdx * ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length - 1)));
//   };
//   const getY = (p) => CONFIG.height - CONFIG.padding - ((p - minP) / range) * (CONFIG.height - CONFIG.padding * 2);

//   // 3. DRAW THE "STRENGTH RIBBON" (Background Glow for Uptrend)
//   if (uptrendStartIndex >= startIdx && uptrendStartIndex <= endIdx) {
//     const startX = getX(uptrendStartIndex);
//     const grad = ctx.createLinearGradient(startX, 0, CONFIG.width, 0);
//     grad.addColorStop(0, 'rgba(8, 153, 129, 0)');
//     grad.addColorStop(1, 'rgba(8, 153, 129, 0.15)');
//     ctx.fillStyle = grad;
//     ctx.fillRect(startX, CONFIG.padding, CONFIG.width - startX - CONFIG.padding, CONFIG.height - (CONFIG.padding * 2));
//   }

//   // 4. DRAW CANDLESTICKS
//   visibleData.forEach((d, i) => {
//     const globalIdx = startIdx + i;
//     const x = getX(globalIdx);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
//     const candleWidth = ((CONFIG.width - CONFIG.padding * 2) / visibleData.length) * 0.8;
    
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath(); ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low)); ctx.stroke();
    
//     ctx.fillStyle = color;
//     const bodyTop = getY(Math.max(d.open, d.close));
//     const bodyBottom = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // 5. DRAW WEAKNESS (Red Descending Line)
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 6. DRAW SUPPORT BASELINE (Teal)
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.5)';
//   ctx.lineWidth = 2;
//   ctx.setLineDash([10, 5]);
//   ctx.beginPath();
//   ctx.moveTo(CONFIG.padding, getY(data[lowIndex].low));
//   ctx.lineTo(CONFIG.width - CONFIG.padding, getY(data[lowIndex].low));
//   ctx.stroke();
//   ctx.setLineDash([]);

//   // 7. DRAW PRECISION UPTREND MARKER
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);

//   ctx.shadowBlur = 15;
//   ctx.shadowColor = '#00ff00';
//   ctx.fillStyle = '#00ff00';
  
//   // Upward Arrowhead
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 15);
//   ctx.lineTo(upX - 10, upY + 35);
//   ctx.lineTo(upX + 10, upY + 35);
//   ctx.fill();

//   // 8. TEXT ANNOTATION (For Human Audit)
//   ctx.fillStyle = '#ffffff';
//   ctx.shadowBlur = 0;
//   ctx.font = '12px Courier New';
//   ctx.fillText(`START UPTREND: IDX ${uptrendStartIndex}`, upX - 50, upY + 50);

//   return canvas.toBuffer('image/png');
// }


// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. CALCULATE BOUNDS WITH GUARANTEED PADDING
//   const buffer = 5;
//   const startIdx = Math.max(0, highIndex - buffer);
  
//   // Force the chart to extend at least 15 bars PAST the uptrend start
//   // This ensures there is "white space" on the right for the arrow and text
//   const rightSidePadding = 15; 
//   const endIdx = Math.min(data.length - 1, uptrendStartIndex + rightSidePadding);
  
//   const visibleData = data.slice(startIdx, endIdx + 1);
  
//   // ... (Keep your canvas setup the same)

//   // 2. UPDATED X-SCALE
//   // We use visibleData.length + 5 to leave an intentional gap at the far right
//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     const chartAreaWidth = CONFIG.width - (CONFIG.padding * 2);
//     return CONFIG.padding + (relativeIdx * (chartAreaWidth / (visibleData.length + 5)));
//   };

//   // ... (Draw candles and lines)

//   // 3. DRAW UPTREND MARKER WITH CONTRAST
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);

//   // Draw the Green Arrow
//   ctx.fillStyle = '#008000'; // Solid dark green for visibility
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 10, upY + 25);
//   ctx.lineTo(upX + 10, upY + 25);
//   ctx.fill();

//   // Draw the Text in BLACK/DARK GREY so it shows on white
//   ctx.fillStyle = '#000000'; 
//   ctx.font = 'bold 14px Arial';
//   ctx.fillText("UPTREND", upX - 30, upY + 40);

//   return sharedCanvas.toBuffer('image/png');
// }


// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. Reset Canvas
//   ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
//   ctx.fillStyle = '#ffffff';
//   ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

//   // 2. Define Data Bounds
//   const buffer = 10;
//   const rightPadding = 15; // Force extra bars to the right for labels
//   const startIdx = Math.max(0, highIndex - buffer);
//   const endIdx = Math.min(data.length - 1, uptrendStartIndex + rightPadding);
  
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 3. Scaling Engine (Defined inside the function)
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   const maxP = Math.max(...highs);
//   const minP = Math.min(...lows);
//   const range = (maxP - minP) || 1;

//   const getX = (i) => {
//     const relativeIdx = i - startIdx;
//     // We divide by (length + 5) to create a literal gap on the right edge
//     return CONFIG.padding + (relativeIdx * ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length + 5)));
//   };

//   const getY = (p) => {
//     return CONFIG.height - CONFIG.padding - ((p - minP) / range) * (CONFIG.height - CONFIG.padding * 2);
//   };

//   // 4. Draw Strength Ribbon
//   if (uptrendStartIndex >= startIdx && uptrendStartIndex <= endIdx) {
//     const startX = getX(uptrendStartIndex);
//     const grad = ctx.createLinearGradient(startX, 0, CONFIG.width, 0);
//     grad.addColorStop(0, 'rgba(8, 153, 129, 0)');
//     grad.addColorStop(1, 'rgba(8, 153, 129, 0.15)');
//     ctx.fillStyle = grad;
//     ctx.fillRect(startX, CONFIG.padding, CONFIG.width - startX, CONFIG.height - (CONFIG.padding * 2));
//   }

//   // 5. Draw Candlesticks
//   const candleWidth = ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length + 5)) * 0.8;
//   visibleData.forEach((d, i) => {
//     const x = getX(startIdx + i);
//     const color = d.close >= d.open ? '#089981' : '#f23645';
    
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 1;
//     ctx.beginPath(); 
//     ctx.moveTo(x, getY(d.high)); 
//     ctx.lineTo(x, getY(d.low)); 
//     ctx.stroke();
    
//     ctx.fillStyle = color;
//     const bodyTop = getY(Math.max(d.open, d.close));
//     const bodyBottom = getY(Math.min(d.open, d.close));
//     ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
//   });

//   // 6. Draw Annotations (Weakness Line & Support)
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. Draw Uptrend Marker (The missing piece)
//   const upX = getX(uptrendStartIndex);
//   const upY = getY(data[uptrendStartIndex].low);

//   // Arrow
//   ctx.fillStyle = '#008000'; 
//   ctx.beginPath();
//   ctx.moveTo(upX, upY + 10);
//   ctx.lineTo(upX - 8, upY + 25);
//   ctx.lineTo(upX + 8, upY + 25);
//   ctx.fill();

//   // Label - Using black for contrast on white background
//   ctx.fillStyle = '#000000';
//   ctx.font = 'bold 12px Arial';
//   ctx.fillText(`UPTREND: ${uptrendStartIndex}`, upX - 40, upY + 40);

//   return sharedCanvas.toBuffer('image/png');
// }

/**
* API ENDPOINT
*/

// ohlcData: data,
// highIndex: highIndex,
// lowIndex : lowIndex
server.post('/api/generate-validation-swing', (req, res) => {
  console.log('hello...b4 starting...');
  const { symbol, ohlcData, highIndex, lowIndex, uptrendStartIndex } = req.body;
  // const symbol = 'nasdaq';

  console.log('b4 starting...');

  if (!ohlcData || highIndex === undefined || lowIndex === undefined) {
      return res.status(400).json({ error: "Missing indices" });
  }

  console.log('starting.uptrendStartIndex..'+ uptrendStartIndex);

  try {
    // console.log('ohlc..' + JSON.stringify(ohlcData));
      const buffer = drawValidationChart(ohlcData, symbol, highIndex, lowIndex, uptrendStartIndex);
      const fileName = `${symbol}_${Date.now()}.png`;
      fs.writeFileSync(path.join(STORAGE_DIR, fileName), buffer);

      console.log('file path is...' + path.join(STORAGE_DIR, fileName));

      // res.status(500).json({ error: 'err'});
      
      // if(trainMode)

      res.json({
          success: true,
          imagePath: path.join(STORAGE_DIR, fileName),
          fileBuffer: {
            ohlcData, symbol, highIndex, lowIndex, uptrendStartIndex
          }
      });
  } catch (err) {
      console.log('err ...' + err.message);
      res.status(500).json({ error: err.message });
  }
});


// Singleton model variable to avoid reloading for every request
let model = null;
/**
 * Load MobileNet once when the server starts
 */
const loadModel = async () => {
    if (!model) {
        console.log("Loading TensorFlow MobileNet...");
        model = await mobilenet.load();
        console.log("Model loaded successfully.");
    }
};

/**
 * Feature Extraction Helper
 */
async function getEmbedding(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    const tfimage = tf.node.decodeImage(buffer, 3);
    
    // We use the 'infer' method to get the vector before the classification layer
    const embedding = model.infer(tfimage, true);
    const vector = await embedding.array();

    // Memory cleanup
    tfimage.dispose();
    embedding.dispose();

    return vector[0];
}

/**
 * API ENDPOINT: Compare Input to Reference
 */
server.post('/api/compare-trades', async (req, res) => {
    const { referenceImageName, inputImageName, buffer } = req.body;

    let fileBuffer = null;
    if(req.body.buffer) {
      fileBuffer = req.body.buffer;
    }

    // const refPath = path.join(STORAGE_DIR, referenceImageName);
    // const inputPath = path.join(STORAGE_DIR, inputImageName);

    const refPath = referenceImageName;
    const inputPath = inputImageName;

    if (!fs.existsSync(refPath) || !fs.existsSync(inputPath)) {
        return res.status(404).json({ error: "One or both images not found." });
    }

    try {
        await loadModel();

        const refVector = await getEmbedding(refPath);
        const inputVector = await getEmbedding(inputPath);

        const similarity = cosine(refVector, inputVector);
        
        // Confidence Logic: Scaling similarity to a human-readable factor
        const confidence = (similarity * 100).toFixed(2);

        const fileName = `${Date.now()}.png`;
        console.log('b4 file bufffer......');
        console.log('fileBuffer..' + fileBuffer);
        if(fileBuffer) {
          console.log('fileBuffer..similarity...' + similarity );

          const buffer = drawValidationChart(
            fileBuffer.ohlcData, 
            fileBuffer.symbol, 
            fileBuffer.highIndex, 
            fileBuffer.lowIndex,
            fileBuffer.uptrendStartIndex
          );
          const fileName = `${fileBuffer.symbol}_${parseInt(confidence)}_${Date.now()}.png`;

          console.log('similarity...' + similarity);
          console.log('uptrendStartIndex..' + fileBuffer.uptrendStartIndex);
          if(similarity < .85 ) {
            // store in weekness folder
            fs.writeFileSync(path.join(NOISE_WEAKENSS_TRAIN_STORAGE_DIR, fileName), buffer);
          }
          else{
            // store in strength folder
            fs.writeFileSync(path.join(WEAKENSS_TRAIN_STORAGE_DIR, fileName), buffer);
          }
        }
        res.json({
            success: true,
            confidenceFactor: `${confidence}%`,
            similarityScore: similarity,
            matchDetected: similarity > 0.85,
            analysis: similarity > 0.85 ? 
                "High geometric similarity to reference weakness pattern." : 
                "Pattern does not sufficiently match the reference."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal analysis error." });
    }
    finally {
      // --- AUTO-DELETE LOGIC ---
      // We delete the input signal image to save space. 
      // Note: You might want to keep the 'reference' image if it's part of your library.
      try {
          if (fs.existsSync(inputPath)) {
              fs.unlinkSync(inputPath); 
              console.log(`Temporary signal image deleted: ${inputPath}`);
          }
          // Uncomment below if you also want to delete the reference after one-time use
          // fs.unlinkSync(refPath); 
      } catch (cleanupErr) {
          console.error("Cleanup Error:", cleanupErr);
      }
  }
});

