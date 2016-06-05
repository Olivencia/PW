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
  var users = db.get().collection('users');
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
      discs.find().limit(10).toArray(function(err, last_docs) {
        last_docs.forEach(function(doc){
          doc.url = 'http://localhost:3000/product' + encodeParams(doc);
        });
        discs.find().sort({ "rating": -1 }).limit(10).toArray(function(err, rating_doc) {
          rating_doc.forEach(function(doc){
            doc.url = 'http://localhost:3000/product' + encodeParams(doc);
          });
          if(req.url.split("?")[1] !== undefined){
            var js_params = decodeParams(req.url.split("?")[1]);
            users.find({username: js_params.username}).toArray(function(err, login_user) {
              //comparar contraseñas
              if(login_user[0] !== undefined){
              console.log(login_user[0] + " -> " + js_params.pass);
              req.session.nombre = login_user[0].first_name;
              req.session.username = login_user[0].username;
              res.render('template', { title: 'DiscoShop', more_seller_discs: more_seller_docs, categories: category_docs, last_added: last_docs, top_rated: rating_doc, user: 'Hola, ' + req.session.nombre, page: 'home' });
            }
            else {
              res.render('template', { title: 'DiscoShop', more_seller_discs: more_seller_docs, categories: category_docs, last_added: last_docs, top_rated: rating_doc,user: 'Entrar', page: 'home' });
            }
           });
          }
          else {
            var login_user = 'Entrar';
            if(req.session.nombre !== undefined) login_user = 'Hola, ' + req.session.nombre;
            res.render('template', { title: 'DiscoShop', more_seller_discs: more_seller_docs, categories: category_docs, last_added: last_docs, top_rated: rating_doc,user: login_user, page: 'home' });
          }
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
      cat_docs[0].url = 'http://localhost:3000/product' + encodeParams(cat_docs[0]);
      var feature_doc = cat_docs[0];
      cat_docs.splice(0,1);
      cat_docs.forEach(function(doc){
        doc.url = 'http://localhost:3000/product' + encodeParams(doc);
      });
      discs.distinct("genre", function(err, cat_section_docs) {
        var category_docs = {};
        var cnt = 1;
        cat_section_docs.forEach(function(doc){
         category_docs["cat"+cnt] = doc;
         cnt++;
        });
      discs.find().sort( { sold: -1 } ).limit(5).toArray(function(err, more_seller_docs) {
      more_seller_docs.forEach(function(doc){
        doc.url = 'http://localhost:3000/product' + encodeParams(doc);
      });
      var login_user = 'Entrar';
      if(req.session.nombre !== undefined) login_user = 'Hola, ' + req.session.nombre;
      res.render('template', { title: params.cat.toUpperCase(), feature_disc: feature_doc, cat_discs: cat_docs, more_seller_discs: more_seller_docs, categories: category_docs, user: login_user,  page: 'category' });
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
          var login_user = 'Entrar';
          if(req.session.nombre !== undefined) login_user = 'Hola, ' + req.session.nombre;
          res.render('template', { disc_data: docu[0], more_seller_discs: more_seller_docs, categories: category_docs, user: login_user, page: 'product' });
      });
    });
  });
});

/* subscripcion page. */
router.get('/subscription', function(req, res, next) {
  var login_user = 'Entrar';
  if(req.session.nombre !== undefined) login_user = 'Hola, ' + req.session.nombre;
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
      var users = db.get().collection('users');
      users.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
          res.render('template', { title: 'subscription', categories: category_docs, user: login_user, page: 'subs' });
      });
    }
    else res.render('template', { title: 'subscription', categories: category_docs, user: login_user, page: 'subs' });
  });
});

/* admin page. */
router.get('/admin', function(req, res, next) {
  var login_user = 'Entrar';
  if(req.session.username !== undefined){
    var users = db.get().collection('users');
    users.find({username: req.session.username}).toArray(function(err, admin_user) {
      if(admin_user[0].privileges !== undefined && admin_user[0].privileges == 'y' ){

      login_user = 'Hola, ' + req.session.nombre;
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
          var discs = db.get().collection('discs');
          discs.insertOne(JSON.parse(JSON.stringify(json_data)), function(err, result) {
              res.render('template', { title: 'admin', user: login_user, categories: category_docs, page: 'admin' });
          });
        }
        else res.render('template', { title: 'admin', categories: category_docs, user: login_user, page: 'admin' });
      });
      }
      else res.send('Acceso denegado. Tu cuenta no tiene los privilegios suficientes.');
    });
  }
  else res.send('Acceso denegado. Por favor entra con una cuenta con privilegios.');
});

module.exports = router;
