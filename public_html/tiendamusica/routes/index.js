var express = require('express');
var router = express.Router();
var url = require('url');
var jQuery = require('jquery');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db = require('../db');

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

/* home page. */
router.get('/', function(req, res, next) {
  params = req.url;
  //console.log(params);
  res.render('template', { title: 'DiscoShop', prueba: 'hola', page: 'home' });
});

/* Rock category page.*/ 
router.get('/category', function(req, res, next) {
  //console.log(decodeParams(req.url.split("?")[1]));
  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
  var cat = db.get().collection('discs');
  cat.find({genre: params.cat}).toArray(function(err, docs) {
      if(err)
      console.log("Cant find at DB");
    else{
      docs.forEach(function(doc){
        doc.title = doc.title.split('+').join(' ');
        doc.author = doc.author.split('+').join(' ');
      });
    res.render('template', { title: 'Sección ' + params.cat.toUpperCase(), prueba: 'hola', discs: docs , page: 'category' });
    }
  });

});

/* product page. */
router.get('/producto', function(req, res, next) {

  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
  var cat = db.get().collection('discs');
  cat.find({genre: params.cat}).toArray(function(err, docs) {
      if(err)
      console.log("Cant find at DB");
    else{
      console.log(docs[2]);
      res.render('template', { title: 'producto', prueba: 'hola', page: 'product' });
    }
  });
});

/* subscripcion page. */
router.get('/subscripcion', function(req, res, next) {
  writeData(req.url.split("?")[1], 'users');
  res.render('template', { title: 'subscripcion', prueba: 'hola', page: 'subs' });
});

/* admin page. */
router.get('/admin', function(req, res, next) {
  var json_data = decodeParams(req.url.split("?")[1]);
  var collection = db.get().collection('discs');
  collection.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
    if(err)
      console.log("Cant insertOne to DB");
    else{
      console.log("Insert to database");
      res.render('template', { title: 'admin', prueba: 'hola', page: 'admin' });
    }
  });
});


module.exports = router;
