var randomstring = require("randomstring");
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var util = require('util');
var app = express();

function fileExists(filename){
	try{
		require('fs').accessSync(filename)
		return true;
	}catch(e){
		return false;
	}
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport('smtp://172.18.0.1');

function sendMessage(data, id){
    var message = 'Nombre: '+data.first_name+' '+data.last_name+'\nEmail: '+data.email+'\nID: '+id+'\nTitulo de Mensaje: '+data.subject+'\nMensaje:\n\n'+data.message;
    var mailOptions = {
        from: '"Fundacion Retinitis Pigmentosa de Puerto Rico" <no-reply@jadorno.com>',
        to: 'jadorno@mac.com',
        subject: 'Mensaje Recibido',
        text: message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendRegistry(data, id){
    var message = 'Nombre: '+data.first_name+' '+data.last_name+'\nTelefono: '+data.phone_number+'\nEmail: '+data.email+'\nDireccion: '+data.address+'\nID: '+id;
    var mailOptions = {
        from: '"Fundacion Retinitis Pigmentosa de Puerto Rico" <no-reply@jadorno.com>',
        to: 'jadorno@mac.com',
        subject: 'Paciente Registrado',
        text: message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

// Enables the use of static pages and files
app.use('/', express.static(__dirname+'/html'));

app.post('/submit.application', function(req, res){
	var form = new formidable.IncomingForm();
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
		res.redirect('/error.html');
	});
	form.on('end', function() {
		res.redirect('/recibido.html');
	});
    form.parse(req, function(err, fields, files) {
    	do { applicationID = randomstring.generate(7); } 
    	while(fileExists(__dirname+'/submit/application/'+applicationID));
    	sendRegistry(fields, applicationID);
    	var outputPath = __dirname+'/submit/application/'+applicationID;
    	fs.outputJson(outputPath+'.json', fields, function(err) {
    		if(err === null){
    			console.log('Data saved on: '+outputPath+'.json');
    		} else {
    			console.log('Error on attempting to save on: '+outputPath+'.json');
    		}
    	});
    });
});

app.post('/submit.message', function(req, res){
	var form = new formidable.IncomingForm();
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
		res.redirect('/error.html');
	});
	form.on('end', function() {
		res.redirect('/recibido.html');
	});
    form.parse(req, function(err, fields, files) {
    	do { messageID = randomstring.generate(7); } 
    	while(fileExists(__dirname+'/submit/message/'+messageID));
    	sendMessage(fields, messageID);
    	var outputPath = __dirname+'/submit/message/'+messageID;
    	fs.outputJson(outputPath+'.json', fields, function(err) {
    		if(err === null){
    			console.log('Data saved on: '+outputPath+'.json');
    		} else {
    			console.log('Error on attempting to save on: '+outputPath+'.json');
    		}
    	});
    });
});

app.set('view engine', 'ejs');
app.set('views',__dirname+'/src/views');

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

app.get('/index.html', function(req, res) {
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/home',
        css: 'css/main.css',
        data: {}
    });
});

app.get('/registrate.html', function(req, res) {
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/register',
        css: 'css/main.css',
        data: {}
    });
});

app.get('/contactenos.html', function(req, res) {
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/contact-us',
        css: 'css/main.css',
        data: {}
    });
});

app.get('/recibido.html', function(req, res) {
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/received',
        css: 'css/main.css',
        data: {}
    });
});

app.get('/error.html', function(req, res) {
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/error',
        css: '/css/main.css',
        data: {}
    });
});

app.get('/archivos/2017-06-Paran/index.html', function(req, res) {
    var data = fs.readJsonSync(__dirname+'/src/data/2017-06-Paran.json', {throws: true});
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/gallery-peru-paran',
        css: '/css/main.css',
        data: data
    });
});

app.get('/archivos/2017-06-Universidad/index.html', function(req, res) {
    var data = fs.readJsonSync(__dirname+'/src/data/2017-06-Universidad.json', {throws: true});
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/gallery-peru-university',
        css: '/css/main.css',
        data: data
    });
});

app.get('/archivos/2014-11/index.html', function(req, res) {
    var data = fs.readJsonSync(__dirname+'/src/data/2014-11.json', {throws: true});
    res.render('web-template', {
        title: 'Fundacion Retinitis Pigmentosa de Puerto Rico',
        page: 'pages/gallery-simposio-2014',
        css: '/css/main.css',
        data: data
    });
});

var server = app.listen(8002, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Server Initiated on port %s", port)
});
