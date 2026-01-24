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


const NEW_STORAGE_DIR = path.join(__dirname, 'cnn/train_new/noise');

const NOISE_WEAKENSS_TRAIN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/noise');
const STRONG_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/strong_down');
const WEEK_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/week_down');


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
const chartWidth = 400;
const chartHeight = 400;
const padding = 50;


const sharedCanvas = createCanvas(chartWidth, chartHeight);
const ctx = sharedCanvas.getContext('2d');


// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC CROP
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 12);
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. VERTICAL NORMALIZATION
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.08;
//   minP -= priceRange * 0.08;

//   // --- ADJUSTMENT FOR LEFT MARGIN ---
//   const leftShift = 400; // Increase this value to move the image further to the right
  
//   // Update Scaling helpers to include the leftShift
//   const getX = (i) => padding + leftShift + ((i - startIdx) * ((chartWidth - (padding * 2) - leftShift) / (visibleData.length - 1)));
//   const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

//   // --- 1. DARK BACKGROUND ---
//   ctx.fillStyle = '#000000'; 
//   ctx.fillRect(0, 0, chartWidth, chartHeight);
  
//   // 3. RENDER BASELINE (Zero Plane)
//   const baseY = getY(data[uptrendStartIndex].low);
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.4)';
//   ctx.setLineDash([6, 4]);
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   // Adjusted lines to respect the new margin
//   ctx.moveTo(padding + leftShift, baseY); 
//   ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]);

//   // 4. THE CONTEXT SKELETON: Uptrend Vector
//   ctx.strokeStyle = 'rgba(8, 153, 129, 0.4)'; 
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   ctx.moveTo(getX(uptrendStartIndex), getY(data[uptrendStartIndex].low));
//   ctx.lineTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.stroke();

//   // 5. DRAW CANDLESTICKS
//   const candleWidth = ((chartWidth - padding * 2 - leftShift) / visibleData.length) * 0.75;
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
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
//   });

//   // 6. THE PRIMARY FEATURE: THE DESCENDING WEAKNESS
//   ctx.strokeStyle = '#f23645';
//   ctx.lineWidth = 6; 
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. ANNOTATION (Color changed to white for Dark Mode visibility)
//   ctx.fillStyle = '#FFFFFF'; 
//   ctx.font = 'bold 13px Arial';
//   ctx.fillText('▲ UPTREND START', getX(uptrendStartIndex), baseY + 25);

//   return sharedCanvas.toBuffer('image/png');
// }

// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC CROP: Start exactly at the uptrend to remove prior noise
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 12); // Context after the low
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. VERTICAL NORMALIZATION: Tight zoom on the Valley
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   // 8% padding ensures the peak and base aren't cut off by the canvas edge
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.08;
//   minP -= priceRange * 0.08;

//   // Scaling helpers
//   const getX = (i) => padding + ((i - startIdx) * ((chartWidth - padding * 2) / (visibleData.length - 1)));
//   const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

//   // --- 1. DARK BACKGROUND ---
//   // --- 1. DARK BACKGROUND ---
//   ctx.fillStyle = '#000000'; // Pure black background
//   ctx.fillRect(0, 0, chartWidth, chartHeight);
  
//   // The "Zero Plane": Teal line marks the support level of the uptrend start
//   const baseY = getY(data[uptrendStartIndex+5].low);
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.4)';
//   ctx.setLineDash([6, 4]);
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(padding, baseY); ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]); // Reset for other lines

//   // 4. THE CONTEXT SKELETON: Uptrend Vector
//   // // Muted color so the AI treats this as the "baseline effort"
//   // ctx.strokeStyle = 'rgba(8, 153, 129, 0.4)'; 
//   // ctx.lineWidth = 3;
//   // ctx.beginPath();
//   // ctx.moveTo(getX(uptrendStartIndex+5), getY(data[uptrendStartIndex+5].low));
//   // ctx.lineTo(getX(highIndex), getY(data[highIndex].high));
//   // ctx.stroke();

//   // --- INSTEAD OF THE OLD STEP 4 ---
//   ctx.save();
  
//   // Create a "Glow" effect to help the CNN identify the vector shape
//   ctx.shadowBlur = 15;
//   ctx.shadowColor = '#ff00ff'; 
  
//   ctx.globalAlpha = 0.7; // High visibility
//   ctx.strokeStyle = '#ff00ff'; 
//   ctx.lineWidth = 10; // Extra thick for high "Signal" weight
//   ctx.lineCap = 'round';
  
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();
  
//   ctx.restore(); // Stop the glow from affecting other elements

//   // 5. DRAW CANDLESTICKS (All visible for full context)
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.75;
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
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
//   });

//   // 6. THE PRIMARY FEATURE: THE DESCENDING WEAKNESS
//   // Thickest and highest contrast line for the RAG Vision model
//   ctx.strokeStyle = '#ff00ff';
//   ctx.lineWidth = 9; 
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();

//   // 7. ANNOTATION
//   ctx.fillStyle = '#000000';
//   ctx.font = 'bold 13px Arial';
//   ctx.fillText('▲ UPTREND START', getX(uptrendStartIndex+5), baseY + 25);

//   return sharedCanvas.toBuffer('image/png');
// }


// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 12);
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. VERTICAL NORMALIZATION
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.08;
//   minP -= priceRange * 0.08;

//   const getX = (i) => padding + ((i - startIdx) * ((chartWidth - padding * 2) / (visibleData.length - 1)));
//   const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

//   // --- 1. DARK BACKGROUND ---
//   ctx.fillStyle = '#000000';
//   ctx.fillRect(0, 0, chartWidth, chartHeight);
  
//   // 2. ZERO PLANE (Muted so it doesn't distract the AI)
//   const baseY = getY(data[uptrendStartIndex + 5].low);
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.15)'; 
//   ctx.setLineDash([4, 4]);
//   ctx.beginPath();
//   ctx.moveTo(padding, baseY); ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]);

//   // --- 3. CANDLESTICKS (GHOST EFFECT) ---
//   // Lowering opacity of candles makes the AI treat them as "Context" rather than "Primary Signal"
//   ctx.globalAlpha = 0.4; 
//   const candleWidth = ((chartWidth - padding * 2) / visibleData.length) * 0.75;
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
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
//   });
//   ctx.globalAlpha = 1.0; // Reset for the swing line

//   // --- 4. THE DOWNTREND SWING (NEON HIGHLIGHT) ---
//   ctx.save();
//   // Outer Glow: Creates a wider feature area for the CNN
//   ctx.shadowBlur = 20;
//   ctx.shadowColor = '#ff00ff'; 
  
//   ctx.strokeStyle = '#ffffff'; // White core for maximum contrast against black
//   ctx.lineWidth = 12; // Thick "skeleton"
//   ctx.lineCap = 'round';
  
//   ctx.beginPath();
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
//   ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
//   ctx.stroke();
  
//   // Secondary "Magenta Pulse" line for color-channel detection
//   ctx.shadowBlur = 0;
//   ctx.strokeStyle = '#ff00ff';
//   ctx.lineWidth = 6;
//   ctx.stroke();
//   ctx.restore();

//   // 5. ANNOTATION (White for Dark Mode visibility)
//   ctx.fillStyle = '#ffffff';
//   ctx.font = 'bold 12px Arial';
//   ctx.fillText('▲ START', getX(uptrendStartIndex + 5), baseY + 20);

//   return sharedCanvas.toBuffer('image/png');
// }


// function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
//   // 1. DYNAMIC CROP: Focus on the specific movement
//   const startIdx = uptrendStartIndex;
//   const endIdx = Math.min(data.length - 1, lowIndex + 12); 
//   const visibleData = data.slice(startIdx, endIdx + 1);

//   // 2. VERTICAL NORMALIZATION: Tight zoom on the swing
//   const highs = visibleData.map(d => d.high);
//   const lows = visibleData.map(d => d.low);
//   let maxP = Math.max(...highs);
//   let minP = Math.min(...lows);
  
//   const priceRange = (maxP - minP) || 1;
//   maxP += priceRange * 0.10; // Extra room for the neon glow
//   minP -= priceRange * 0.10;

//   // 3. SCALING HELPERS (Including the 400px Left Shift)
//   const leftShift = 400; 
//   const getX = (i) => padding + leftShift + ((i - startIdx) * ((chartWidth - (padding * 2) - leftShift) / (visibleData.length - 1)));
//   const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

//   // --- RENDER START ---
//   ctx.fillStyle = '#000000'; 
//   ctx.fillRect(0, 0, chartWidth, chartHeight);
  
//   // 4. THE ZERO PLANE (Muted support level)
//   const baseY = getY(data[uptrendStartIndex + 5].low);
//   ctx.strokeStyle = 'rgba(0, 161, 161, 0.2)';
//   ctx.setLineDash([6, 4]);
//   ctx.beginPath();
//   ctx.moveTo(padding + leftShift, baseY); 
//   ctx.lineTo(chartWidth - padding, baseY);
//   ctx.stroke();
//   ctx.setLineDash([]);

//   // 5. DRAW GHOST CANDLESTICKS (Low Opacity)
//   // This helps the AI treat the candles as "Context" rather than "Primary Signal"
//   ctx.globalAlpha = 0.35; 
//   const candleWidth = ((chartWidth - padding * 2 - leftShift) / visibleData.length) * 0.75;
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
//     ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
//   });
//   ctx.globalAlpha = 1.0; 

//   // --- 6. THE NEON CURVATURE TRACE (The Master Feature) ---
//   ctx.save();
//   // Apply a thick neon glow to emphasize the "Shape" of the weakness
//   ctx.shadowBlur = 20;
//   ctx.shadowColor = '#ff00ff'; 
//   ctx.strokeStyle = '#ffffff'; // White core for maximum edge detection
//   ctx.lineWidth = 10;
//   ctx.lineCap = 'round';
//   ctx.lineJoin = 'round'; // Essential for smooth curvature
  
//   ctx.beginPath();
//   // Anchor at the actual High point
//   ctx.moveTo(getX(highIndex), getY(data[highIndex].high));

//   // TRACING: Instead of a straight line, we follow the price ceiling
//   for (let i = highIndex + 1; i <= lowIndex; i++) {
//     ctx.lineTo(getX(i), getY(data[i].high));
//   }
//   ctx.stroke();

//   // Secondary Magenta Pulse (Sharpens the color for the CNN)
//   ctx.shadowBlur = 0;
//   ctx.strokeStyle = '#ff00ff';
//   ctx.lineWidth = 4;
//   ctx.stroke();
//   ctx.restore();

//   // 7. ANNOTATION
//   ctx.fillStyle = '#FFFFFF'; 
//   ctx.font = 'bold 12px Arial';
//   ctx.fillText('▲ START', getX(uptrendStartIndex + 5), baseY + 25);

//   return sharedCanvas.toBuffer('image/png');
// }


/**
 * Renders a full diagnostic chart with curvature tracking and 
 * linear baseline comparison to help AI detect swing precision.
 */
/**
 * FINAL OPTIMIZED VERSION: Curvature & Baseline Comparison
 * Removes redundant markers to maximize Signal-to-Noise ratio for CNN.
 */
/**
 * ULTRA-SIGNAL VERSION: Engineered to eliminate "Noise" classification.
 * Minimizes background detail to force AI focus on Curvature and Baseline.
 */
function drawValidationChart(data, symbol, highIndex, lowIndex, uptrendStartIndex) {
  const startIdx = uptrendStartIndex;

  console
  const endIdx = Math.min(data.length - 1, lowIndex + 12); 
  const visibleData = data.slice(startIdx, endIdx + 1);

  // 1. VERTICAL NORMALIZATION
  const highs = visibleData.map(d => d.high);
  const lows = visibleData.map(d => d.low);
  let maxP = Math.max(...highs);
  let minP = Math.min(...lows);
  
  const priceRange = (maxP - minP) || 1;
  maxP += priceRange * 0.15; 
  minP -= priceRange * 0.15;

  // 2. SCALING HELPERS (400px Left Gutter)
  const leftShift = 0; 
  const getX = (i) => padding + leftShift + ((i - startIdx) * ((chartWidth - (padding * 2) - leftShift) / (visibleData.length - 1)));
  const getY = (p) => chartHeight - padding - ((p - minP) / (maxP - minP)) * (chartHeight - padding * 2);

  // --- RENDER START ---
  ctx.fillStyle = '#000000'; 
  ctx.fillRect(0, 0, chartWidth, chartHeight);
  
  // 3. REMOVED ZERO PLANE (To prevent horizontal line noise)

  // 4. DRAW GHOST CANDLESTICKS (Ultra-Low Opacity)
  // Dropped to 0.10 so the AI treats them as non-existent noise
  ctx.globalAlpha = 0.10; 
  const candleWidth = ((chartWidth - padding * 2 - leftShift) / visibleData.length) * 0.75;
  visibleData.forEach((d, i) => {
    const x = getX(startIdx + i);
    const color = d.close >= d.open ? '#089981' : '#f23645';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1; // Thinner context lines
    ctx.beginPath();
    ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low));
    ctx.stroke();

    ctx.fillStyle = color;
    const t = getY(Math.max(d.open, d.close));
    const b = getY(Math.min(d.open, d.close));
    ctx.fillRect(x - candleWidth / 2, t, candleWidth, Math.max(b - t, 1.5));
  });
  ctx.globalAlpha = 1.0; 

  // 5. THE REFERENCE BASELINE (Linear Anchor)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Brighter white for better anchor
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 3; // Thicker dashed line
  ctx.beginPath();
  ctx.moveTo(getX(uptrendStartIndex), getY(data[uptrendStartIndex].low));
  ctx.lineTo(getX(lowIndex), getY(data[lowIndex].low));
  ctx.stroke();
  ctx.restore();

  // 6. THE NEON CURVATURE TRACE (The Signal)
  ctx.save();
  ctx.shadowBlur = 25; // Increased glow
  ctx.shadowColor = '#ff00ff'; 
  ctx.strokeStyle = '#ffffff'; 
  ctx.lineWidth = 14; // Thicker line for higher feature weight
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(getX(highIndex), getY(data[highIndex].high));
  for (let i = highIndex + 1; i <= lowIndex; i++) {
    ctx.lineTo(getX(i), getY(data[i].high));
  }
  ctx.stroke();
  ctx.restore();

  // 7. EXHAUSTION HIGHLIGHT (The Cyan Target)
  ctx.save();
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#00ffff';
  ctx.strokeStyle = '#00ffff'; 
  ctx.lineWidth = 10; // Extra thick "landing pad"
  ctx.beginPath();
  ctx.moveTo(getX(lowIndex - 8), getY(data[lowIndex].low)); // Longer bar
  ctx.lineTo(getX(lowIndex + 8), getY(data[lowIndex].low));
  ctx.stroke();
  ctx.restore();

  // 8. REMOVED TEXT ANNOTATIONS (AI often treats text as noise/artifacts)

  return sharedCanvas.toBuffer('image/png');
}

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

  
  // const NOISE_WEAKENSS_TRAIN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/noise');
  // const STRONG_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/strong_down');
  // const WEEK_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/week_down');

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
  
      // const NOISE_WEAKENSS_TRAIN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/noise');
      // const STRONG_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/strong_down');
      // const WEEK_DOWN_STORAGE_DIR_TRAIN = path.join(__dirname, 'cnn/train_new/week_down');


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
      try {
          console.log("🏗️ Loading Custom Trading Model (v2_balanced)...");
          
          // Point this to your new versioned folder
          const modelPath = 'file://./models/model_v2_balanced/model.json';
          
          model = await tf.loadLayersModel(modelPath);
          
          console.log("✅ Custom Model loaded successfully.");
      } catch (error) {
          console.error("❌ Error loading model. Check if the path is correct:", error.message);
      }
  }
};
/**
 * Feature Extraction Helper
 */
const getEmbedding = (imageInput) => {
  return tf.tidy(() => {
      let tensor;

      // 1. Check if imageInput is a string (path) or a Buffer
      if (typeof imageInput === 'string') {
          const buffer = fs.readFileSync(imageInput);
          tensor = tf.node.decodeImage(buffer, 3); // Decodes to numeric [H, W, 3]
      } else if (Buffer.isBuffer(imageInput)) {
          tensor = tf.node.decodeImage(imageInput, 3);
      } else {
          tensor = imageInput; // Assume it's already a tensor
      }

      // 2. NOW you can resize it (because it is numeric)
      const resized = tf.image.resizeBilinear(tensor, [200, 200]);

      // 3. Normalize and batch
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);

      // 4. Predict
      return model.predict(batched);
  });
};
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

    console.log('-----------------');
    console.log('refPath' + refPath);
    console.log('inputPath' + inputPath);
    if (!fs.existsSync(refPath) || !fs.existsSync(inputPath)) {
        return res.status(404).json({ error: "One or both images not found." });
    }

    try {
      await loadModel();

      // 1. Get raw prediction tensors
      const refPrediction = await getEmbedding(refPath);
      const inputPrediction = await getEmbedding(inputPath);

      // 2. Extract the numbers as JS arrays [noise, strong_down, week_down]
      const refProbs = Array.from(refPrediction.dataSync());
      const inputProbs = Array.from(inputPrediction.dataSync());

      // 3. Define similarity based on the target class (Week Down is index 2)
      // We calculate how close the input's confidence is to the reference's confidence
      const similarity = 1 - Math.abs(refProbs[2] - inputProbs[2]);
      
      // 4. Determine if it's a "Match"
      // A match occurs if both predict the same category AND confidence is high
      const refWinner = refProbs.indexOf(Math.max(...refProbs));
      const inputWinner = inputProbs.indexOf(Math.max(...inputProbs));
      
      const matchDetected = (refWinner === inputWinner) && (inputProbs[inputWinner] > 0.80);
      const confidence = (inputProbs[inputWinner] * 100).toFixed(2);

      console.log(`Ref WeekDown: ${refProbs[2].toFixed(4)} | Input WeekDown: ${inputProbs[2].toFixed(4)}`);
      console.log(`Match Result: ${matchDetected} | Similarity: ${similarity.toFixed(4)}`);

      // if(fileBuffer) {
      //     // ... (Your existing chart drawing logic)
          
      //     // Logic: If they are both the same category (matchDetected), store in Strength
      //     if(matchDetected) {
      //         fs.writeFileSync(path.join(WEAKENSS_TRAIN_STORAGE_DIR, fileName), chartBuffer);
      //     } else {
      //         fs.writeFileSync(path.join(NOISE_WEAKENSS_TRAIN_STORAGE_DIR, fileName), chartBuffer);
      //     }
      // }

      res.json({
          success: true,
          confidenceFactor: `${similarity*100}%`,
          similarityScore: similarity,
          matchDetected: matchDetected,
          analysis: matchDetected ? 
              "High geometric similarity to reference pattern." : 
              "Pattern does not sufficiently match the reference."
      });

    } catch (err) {
        console.error("AI Analysis Error:", err);
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

