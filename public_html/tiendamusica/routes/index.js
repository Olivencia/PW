var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
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

//GET pop category page. 
router.get('/producto', function(req, res, next) {
  res.render('template', { title: 'producto', prueba: 'hola', page: 'product' });
});

//GET pop category page. 
router.get('/subscripcion', function(req, res, next) {
  res.render('template', { title: 'subscripcion', prueba: 'hola', page: 'subs' });
});

module.exports = router;
