const { MongoClient } = require("mongodb");


const express = require("express");
const server = express();
// var memwatch = require('memwatch');


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

