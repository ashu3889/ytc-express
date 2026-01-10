const { MongoClient } = require("mongodb");


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

function drawChart(data, symbol, maskCoords = null) {
  const { width, height, padding } = CHART_CONFIG;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Draw Background
  ctx.fillStyle = CHART_CONFIG.bgColor; // Ensure this is '#ffffff'
  ctx.fillRect(0, 0, width, height);

  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  const range = maxP - minP || 1;

  const getX = (i) => padding + (i * ((width - padding * 2) / (data.length - 1)));
  const getY = (p) => height - padding - ((p - minP) / range) * (height - padding * 2);

  // 2. Draw Candles
  data.forEach((d, i) => {
      const x = getX(i);
      const color = d.close >= d.open ? '#089981' : '#f23645';
      const candleWidth = ((width - padding * 2) / data.length) * 0.7;

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, getY(d.high));
      ctx.lineTo(x, getY(d.low));
      ctx.stroke();

      ctx.fillStyle = color;
      const bodyTop = getY(Math.max(d.open, d.close));
      const bodyBottom = getY(Math.min(d.open, d.close));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
  });

  // 3. Apply Inverse Mask (Four-Rectangle Method)
  if (maskCoords) {
      const size = 100; // Size of the visible window
      const half = size / 2;
      
      // Use a very dark grey or black with high opacity
      // We avoid destination-out to prevent the checkered/transparent background
      ctx.fillStyle = 'rgba(20, 20, 20, 0.95)'; 

      // Top Rectangle (Full width, from top to spotlight top)
      ctx.fillRect(0, 0, width, maskCoords.y - half);
      
      // Bottom Rectangle (Full width, from spotlight bottom to canvas bottom)
      ctx.fillRect(0, maskCoords.y + half, width, height - (maskCoords.y + half));
      
      // Left Rectangle (From spotlight top to bottom, from left edge to spotlight left)
      ctx.fillRect(0, maskCoords.y - half, maskCoords.x - half, size);
      
      // Right Rectangle (From spotlight top to bottom, from spotlight right to right edge)
      ctx.fillRect(maskCoords.x + half, maskCoords.y - half, width - (maskCoords.x + half), size);

      // 4. Draw Border and Label
      ctx.strokeStyle = '#2962FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(maskCoords.x - half, maskCoords.y - half, size, size);
      
      ctx.fillStyle = '#2962FF';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('VISIBLE REGION', maskCoords.x - half, maskCoords.y - half - 8);
  }

  return canvas.toBuffer('image/png');
}

/**
* API ENDPOINT
*/
server.post('/api/generate-rag-chart', (req, res) => {
  const { ohlcData, maskTarget } = req.body;
  const symbol = "Nasdaq";

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


/**
 * HELPER: Map Array Index to Pixel Coordinates
 * Prevents errors with duplicate price values.
 */
function getPixelCoordsByIndex(index, allData, type = 'high') {
  if (index < 0 || index >= allData.length) return null;

  const chartWidth = CONFIG.width - (CONFIG.padding * 2);
  const x = CONFIG.padding + (index * (chartWidth / (allData.length - 1)));

  const highs = allData.map(d => d.high);
  const lows = allData.map(d => d.low);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  const range = maxP - minP || 1;
  
  // Use the specific price at that index (High for start, Low for end)
  const price = type === 'high' ? allData[index].high : allData[index].low;
  
  const chartHeight = CONFIG.height - (CONFIG.padding * 2);
  const y = CONFIG.height - CONFIG.padding - ((price - minP) / range) * chartHeight;

  return { x: Math.round(x), y: Math.round(y) };
}

/**
* CORE: drawValidationChart
* Renders the candles, the trendline, the support base, and the spotlight.
*/
function drawValidationChart(data, symbol, highIndex, lowIndex) {
  // 1. Determine the "Zoom" Range
  // We add a small buffer (e.g., 5 candles) so the start/end aren't touching the edges
  const buffer = 5;
  const startIdx = Math.max(0, highIndex - buffer);
  const endIdx = Math.min(data.length - 1, lowIndex + buffer);
  const visibleData = data.slice(startIdx, endIdx);

  const canvas = createCanvas(CONFIG.width, CONFIG.height);
  const ctx = canvas.getContext('2d');

  // White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  // 2. Calculate Scales based ONLY on the visible slice
  const highs = visibleData.map(d => d.high);
  const lows = visibleData.map(d => d.low);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  const range = maxP - minP || 1;

  // Mapping functions localized to the zoom window
  const getX = (i) => {
      // i is the global index; we map its relative position in the slice
      const relativeIdx = i - startIdx;
      return CONFIG.padding + (relativeIdx * ((CONFIG.width - CONFIG.padding * 2) / (visibleData.length - 1)));
  };
  const getY = (p) => CONFIG.height - CONFIG.padding - ((p - minP) / range) * (CONFIG.height - CONFIG.padding * 2);

  // 3. Draw the Magnified Candles
  visibleData.forEach((d, i) => {
      const globalIdx = startIdx + i;
      const x = getX(globalIdx);
      const color = d.close >= d.open ? '#089981' : '#f23645';
      const candleWidth = ((CONFIG.width - CONFIG.padding * 2) / visibleData.length) * 0.7;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, getY(d.high)); ctx.lineTo(x, getY(d.low)); ctx.stroke();
      
      ctx.fillStyle = color;
      const bodyTop = getY(Math.max(d.open, d.close));
      const bodyBottom = getY(Math.min(d.open, d.close));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
  });

  // 4. Draw Prominent Validation Lines
  const highCoords = { x: getX(highIndex), y: getY(data[highIndex].high) };
  const lowCoords = { x: getX(lowIndex), y: getY(data[lowIndex].low) };

  // Support Baseline (Teal) - Now spans the zoomed window
  ctx.strokeStyle = '#00a1a1';
  ctx.lineWidth = 3; // Thicker for RAG detection
  ctx.beginPath();
  ctx.moveTo(CONFIG.padding, lowCoords.y);
  ctx.lineTo(CONFIG.width - CONFIG.padding, lowCoords.y);
  ctx.stroke();

  // Descending Trendline (Red)
  ctx.strokeStyle = '#f23645';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(highCoords.x, highCoords.y);
  ctx.lineTo(lowCoords.x, lowCoords.y);
  ctx.stroke();

  // Markers
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#333';
  [highCoords, lowCoords].forEach(c => {
      ctx.beginPath(); ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
  });

  return canvas.toBuffer('image/png');
}

/**
* API ENDPOINT
*/

// ohlcData: data,
// highIndex: highIndex,
// lowIndex : lowIndex
server.post('/api/generate-validation-swing', (req, res) => {
  console.log('hello...b4 starting...');
  const { ohlcData, highIndex, lowIndex } = req.body;
  const symbol = 'nasdaq';

  console.log('b4 starting...');

  if (!ohlcData || highIndex === undefined || lowIndex === undefined) {
      return res.status(400).json({ error: "Missing indices" });
  }

  console.log('starting...');

  try {
      const buffer = drawValidationChart(ohlcData, symbol, highIndex, lowIndex);
      const fileName = `valid_${Date.now()}.png`;
      fs.writeFileSync(path.join(STORAGE_DIR, fileName), buffer);

      res.json({
          success: true,
          imageUrl: `http://localhost:3000/view-validation/${fileName}`
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
