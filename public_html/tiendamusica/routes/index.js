var express = require('express');
var router = express.Router();

var url = require('url');


var mysql = require('mysql');

var connection = mysql.createConnection({
   host: 'localhost',
   user: 'shop_admin',
   database: 'tiendamusica',
   port: 3306
});
connection.connect(function(error){
   if(error){
      console.log('Conexion incorrecta.');
   }else{
      console.log('Conexion correcta.');
   }
});

function decodeParams(params) {
    var p = params.split("&");
    if(typeof p == "undefined")
    	p = params;
    var temp = new Array();
    var cnt = 0;
    for(var i=0; i<p.length; i++){
    	temp[cnt] = p[i].split("=")[0];
    	temp[cnt+1] = p[i].split("=")[1];
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
	}
	
  res.render('template', { title: 'subscripcion', prueba: 'hola', page: 'subs' });
});

//GET admin page. 
router.get('/admin', function(req, res, next) {
  res.render('template', { title: 'admin', prueba: 'hola', page: 'admin' });
});

module.exports = router;
