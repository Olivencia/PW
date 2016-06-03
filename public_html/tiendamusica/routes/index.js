var express = require('express');
var router = express.Router();
var url = require('url');
var jQuery = require('jquery');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


function searchValue(obj,needle){
  /*var arr = Object.keys(obj).map(function(k) { return obj[k] });
  console.log(arr);*/

  var parsed = JSON.parse(obj);

  var arr = [];

  for(var x in parsed){
    arr.push(parsed[x]);
}
console.log(arr);
  for (var i = 0; i < obj.length; i++){
    //console.log(obj[i].code);
    if (obj[i].code == needle){
      return obj[i].code;
    }
  }
}

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


function writeData(url_params, collect){
  if( typeof url_params !== "undefined" ){
    var json_data = decodeParams(url_params);
    insertData(json_data, collect);
  }
}

/***** READ DATA **/

function readData(url_params, collect, json_data){
  if( typeof url_params !== "undefined" ){
    getData(json_data, collect);
  }
}

function getData(json_data, collect) {
  var db_url = 'mongodb://localhost:27017/tienda';
  MongoClient.connect(db_url, function(err, db) {
    assert.equal(null, err);
    getDocument(db, function() {
        db.close();
    }, collect, json_data);
  });
};

var docu = new Array();
var x ="no";

var getDocument = function(db, callback, collect, json_data) {
   var cursor =db.collection(collect).find(JSON.parse(JSON.stringify(json_data)));
   //console.log(cursor[0]);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
          //console.dir(doc);
          x="hola";
      } else {
         callback();
      }
   });
   console.log(x);
};


//* home page. */*/
router.get('/', function(req, res, next) {
  params = req.url;
  //console.log(params);
  res.render('template', { title: 'DiscoShop', prueba: 'hola', page: 'home' });
});

/* Rock category page.*/ 
router.get('/category', function(req, res, next) {
  //console.log(decodeParams(req.url.split("?")[1]));
  var obj = decodeParams(req.url.split("?")[1]);
  res.render('template', { title: 'Sección ' + obj.cat, prueba: 'hola', page: 'category' });
});

/* product page. */
router.get('/producto', function(req, res, next) {
  var doc= new Array();
  var obj = decodeParams(req.url.split("?")[1]);
  var json = readData(req.url.split("?")[1], 'discs', obj);
  //console.log(x);
  //console.dir(doc[1]);

  res.render('template', { title: 'producto', prueba: 'hola', page: 'product' });
});

/* subscripcion page. */
router.get('/subscripcion', function(req, res, next) {
  writeData(req.url.split("?")[1], 'users');
  res.render('template', { title: 'subscripcion', prueba: 'hola', page: 'subs' });
});

/* admin page. */
router.get('/admin', function(req, res, next) {
  writeData(req.url.split("?")[1], 'discs');
  res.render('template', { title: 'admin', prueba: 'hola', page: 'admin' });
});


module.exports = router;
