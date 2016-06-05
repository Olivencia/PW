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
  
  var discs = db.get().collection('discs');

  discs.find().sort( { sold: -1 } ).limit(5).toArray(function(err, more_seller_docs) {
    more_seller_docs.forEach(function(doc){
      doc.url = 'http://localhost:3000/product' + encodeParams(doc);
    });
    discs.distinct("genre", function(err, cat_docs) {
      var category_docs = {};
      var cnt = 1;
      cat_docs.forEach(function(doc){
       category_docs["cat"+cnt] = doc;
       cnt++;
      });
      discs.find().toArray(function(err, last_docs) {
        last_docs.forEach(function(doc){
          doc.url = 'http://localhost:3000/product' + encodeParams(doc);
        });
        discs.find().sort({ "rating": -1 }).toArray(function(err, rating_doc) {
          rating_doc.forEach(function(doc){
            doc.url = 'http://localhost:3000/product' + encodeParams(doc);
          });
          res.render('template', { title: 'DiscoShop', more_seller_discs: more_seller_docs, categories: category_docs, last_added: last_docs, top_rated: rating_doc, page: 'home' });
        });
      });
    });
  });
});

/* category page.*/ 
router.get('/category', function(req, res, next) {
  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
  discs.find({genre: params.cat}).toArray(function(err, cat_docs) {
      var feature_doc = cat_docs[0];
      cat_docs.splice(0,1);
      cat_docs.forEach(function(doc){
        doc.url = 'http://localhost:3000/product' + encodeParams(doc);
        //console.log(doc.url);
        //doc.title = doc.title.split('+').join(' ');
        //doc.author = doc.author.split('+').join(' ');
      });
      discs.distinct("genre", function(err, cat_docs) {
        var category_docs = {};
        var cnt = 1;
        cat_docs.forEach(function(doc){
         category_docs["cat"+cnt] = doc;
         cnt++;
        });
      discs.find().sort( { sold: -1 } ).limit(5).toArray(function(err, more_seller_docs) {
      more_seller_docs.forEach(function(doc){
        doc.url = 'http://localhost:3000/product' + encodeParams(doc);
        //doc.title = doc.title.split('+').join(' ');
        //doc.author = doc.author.split('+').join(' ');
      });
      res.render('template', { title: 'SECCIÓN ' + params.cat.toUpperCase(), feature_disc: feature_doc, cat_discs: cat_docs, more_seller_discs: more_seller_docs, categories: category_docs,  page: 'category' });
      });
    });
  });

});

/* product page. */
router.get('/product', function(req, res, next) {

  var params = decodeParams(req.url.split("?")[1]);
  var discs = db.get().collection('discs');
      
  params.title = params.title.split('%20').join(' ');
  params.author = params.author.split('%20').join(' ');

  discs.find({title: params.title}).toArray(function(err, docu) {
    discs.distinct("genre", function(err, cat_docs) {
      var category_docs = {};
      var cnt = 1;
      cat_docs.forEach(function(doc){
       category_docs["cat"+cnt] = doc;
       cnt++;
      });
      discs.find().sort( { sold: -1 } ).limit(5).toArray(function(err, more_seller_docs) {
          more_seller_docs.forEach(function(doc){
            doc.url = 'http://localhost:3000/product' + encodeParams(doc);
            doc.title = doc.title.split('+').join(' ');
            doc.author = doc.author.split('+').join(' ');
          });
          res.render('template', { disc_data: docu[0], more_seller_discs: more_seller_docs, categories: category_docs, page: 'product' });
      });
    });
  });
});

/* subscripcion page. */
router.get('/subscripcion', function(req, res, next) {
  var discs = db.get().collection('discs');
  discs.distinct("genre", function(err, cat_docs) {
      var category_docs = {};
      var cnt = 1;
      cat_docs.forEach(function(doc){
       category_docs["cat"+cnt] = doc;
       cnt++;
      });
    if(req.url.split("?")[1] !== undefined){
      var json_data = decodeParams(req.url.split("?")[1]);
      var collection = db.get().collection('users');
      collection.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
          res.render('template', { title: 'subscripcion', categories: category_docs, page: 'subs' });
      });
    }
    else res.render('template', { title: 'subscripcion', categories: category_docs, page: 'subs' });
  });
});

/* admin page. */
router.get('/admin', function(req, res, next) {
  var discs = db.get().collection('discs');
  discs.distinct("genre", function(err, cat_docs) {
    var category_docs = {};
    var cnt = 1;
    cat_docs.forEach(function(doc){
     category_docs["cat"+cnt] = doc;
     cnt++;
    });
    if(req.url.split("?")[1] !== undefined){
      var json_data = decodeParams(req.url.split("?")[1]);
      var collection = db.get().collection('discs');
      collection.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
          res.render('template', { title: 'admin', page: 'admin' });
      });
    }
    else res.render('template', { title: 'admin', categories: category_docs, page: 'admin' });
  });
});


module.exports = router;
