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

function encodeParams(json){
  var params = '?';
  for (data in json){
    if(data !== '_id') params += data + '=' + json[data] + '&';
  }
  params[params.length-1] = '';
  return params;
}

/* home page. */
router.get('/', function(req, res, next) {
  params = req.url;
  //console.log(params);
  res.render('template', { title: 'DiscoShop', page: 'home' });
});

/* category page.*/ 
router.get('/category', function(req, res, next) {
  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
  discs.find({genre: params.cat}).toArray(function(err, cat_docs) {
      if(err)
      console.log("Cant find at DB");
    else{
      var feature_doc = cat_docs[0];
      cat_docs.splice(0,1);
      cat_docs.forEach(function(doc){
        doc.url = 'http://localhost:3000/product' + encodeParams(doc);
        //console.log(doc.url);
        //doc.title = doc.title.split('+').join(' ');
        //doc.author = doc.author.split('+').join(' ');
      });

      discs.find().limit(5).toArray(function(err, more_seller_docs) {
        if(err)
          console.log("Cant find at DB");
        else{
          more_seller_docs.forEach(function(doc){
            doc.url = 'http://localhost:3000/product' + encodeParams(doc);
            //doc.title = doc.title.split('+').join(' ');
            //doc.author = doc.author.split('+').join(' ');
          });
          res.render('template', { title: 'Sección ' + params.cat.toUpperCase(), feature_disc: feature_doc, cat_discs: cat_docs, more_seller_discs: more_seller_docs,  page: 'category' });
        }
      });
    }
  });

});

/* product page. */
router.get('/product', function(req, res, next) {

  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
      
  params.title = params.title.split('%20').join(' ');
  params.author = params.author.split('%20').join(' ');

  discs.find({title: params.title}).toArray(function(err, docu) {
      if(err)
      console.log("Cant find at DB");
    else{

      discs.find().limit(5).toArray(function(err, more_seller_docs) {
        if(err)
          console.log("Cant find at DB");
        else{
          more_seller_docs.forEach(function(doc){
            doc.url = 'http://localhost:3000/product' + encodeParams(doc);
            doc.title = doc.title.split('+').join(' ');
            doc.author = doc.author.split('+').join(' ');
          });
          console.log(docu[0].songs);
          res.render('template', { disc_data: docu[0], more_seller_discs: more_seller_docs, page: 'product' });
        }
      });
    }
  });
});

/* subscripcion page. */
router.get('/subscripcion', function(req, res, next) {
  if(req.url.split("?")[1] !== undefined){
    var json_data = decodeParams(req.url.split("?")[1]);
    var collection = db.get().collection('users');
    collection.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
      if(err)
        console.log("Cant insertOne to DB");
      else{
        console.log("Insert to database");
        res.render('template', { title: 'subscripcion', page: 'subs' });
      }
    });
  }
  else res.render('template', { title: 'subscripcion', page: 'subs' });
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
      res.render('template', { title: 'admin', page: 'admin' });
    }
  });
});


module.exports = router;
