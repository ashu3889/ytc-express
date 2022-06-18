// mongodb driver
const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = "mongodb+srv://ashu3889:amma2011@cluster0.uwkcv.mongodb.net/?retryWrites=true&w=majority";

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

// db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
//     // get all items
//     dbCollection.find().toArray(function(err, result) {
//         if (err) throw err;
//           console.log(result);
//     });

//     // << db CRUD routes >>

// }, function(err) { // failureCallback
//     throw (err);
// });

module.exports = {
    initialize
};