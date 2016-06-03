var express = require('express');
var router = express.Router();
var url = require('url');
var jQuery = require('jquery');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


function insertData(json_data, collect) {
  var db_url = 'mongodb://localhost:27017/tienda';
  MongoClient.connect(db_url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
    }, collect, json_data);
  });
};

var insertDocument = function(db, callback, collect, json_data) {
   db.collection(collect).insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
    assert.equal(err, null);
    console.log("Data inserted in database");
    callback();
  });
};


function decodeParams(params) {
    var p = params.split("&");
    if(typeof p == "undefined")
      p = params;
    var temp = {};
    var cnt = 0;
    for(var i=0; i<p.length; i++){
      temp[p[i].split("=")[0]] = p[i].split("=")[1];
      cnt+=2;
    }
    return temp;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  params = req.url;
  console.log(params);
  res.render('template', { title: 'DiscoShop', prueba: 'hola', page: 'home' });
});

//GET Rock category page. 
router.get('/rock', function(req, res, next) {
  res.render('template', { title: 'rock', prueba: 'hola', page: 'category' });
});

//GET Rap category page. 
router.get('/rap', function(req, res, next) {
  res.render('template', { title: 'rap', prueba: 'hola', page: 'category' });
});

//GET Metal category page. 
router.get('/metal', function(req, res, next) {
  res.render('template', { title: 'metal', prueba: 'hola', page: 'category' });
});

//GET pop category page. 
router.get('/pop', function(req, res, next) {
  res.render('template', { title: 'pop', prueba: 'hola', page: 'category' });
});

//GET product page. 
router.get('/producto', function(req, res, next) {
  res.render('template', { title: 'producto', prueba: 'hola', page: 'product' });
});

//GET subscripcion page. 
router.get('/subscripcion', function(req, res, next) {
  var url_params = req.url.split("?")[1];
  if( typeof url_params !== "undefined" ){
    var params = decodeParams(url_params);
    var json_data = arrayToJSON(params);
    //insertData(json_data);
  }
  
  res.render('template', { title: 'subscripcion', prueba: 'hola', page: 'subs' });
});

//GET admin page. 
router.get('/admin', function(req, res, next) {
  var url_params = req.url.split("?")[1];
  if( typeof url_params !== "undefined" ){
    var json_data = decodeParams(url_params);
    insertData(json_data, 'discs');
    //console.log(json_data);
  }
  res.render('template', { title: 'admin', prueba: 'hola', page: 'admin' });
});


module.exports = router;
