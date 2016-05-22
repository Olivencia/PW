var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', { title: 'DiscoShop', prueba: 'eii', page: 'home' });
});

//GET Rock category page. 
router.get('/rock', function(req, res, next) {
  res.render('template', { title: 'rock', prueba: 'eii', page: 'category' });
});

//GET Rap category page. 
router.get('/rap', function(req, res, next) {
  res.render('template', { title: 'rap', prueba: 'eii', page: 'category' });
});

//GET Metal category page. 
router.get('/metal', function(req, res, next) {
  res.render('template', { title: 'metal', prueba: 'eii', page: 'category' });
});

//GET pop category page. 
router.get('/pop', function(req, res, next) {
  res.render('template', { title: 'pop', prueba: 'eii', page: 'category' });
});

//GET pop category page. 
router.get('/producto', function(req, res, next) {
  res.render('template', { title: 'producto', prueba: 'eii', page: 'product' });
});

module.exports = router;
