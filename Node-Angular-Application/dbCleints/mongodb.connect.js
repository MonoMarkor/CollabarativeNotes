let MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://note_taker:gTy9iE9gzi1fFuWm@cluster0.ojipjer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const cleint = new MongoClient(url);
var database = cleint.db('kollab_notez');

module.exports = database;