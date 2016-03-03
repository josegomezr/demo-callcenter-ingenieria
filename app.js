// Setup basic express server
var express = require('express');
var app = express();
var _ = require('lodash');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var incidencias_n1 = []
var incidencias_n2 = []
var incidencias_n3 = []
var incidencias_gerencia = []

var contadorIncidencias = 0

io.on('connection', function(socket){
  	socket.on('incidencia:n1', function (data) {
  		console.log('Registrada Incidencia para socket_id', socket.id)
  		data.id = ++contadorIncidencias;
  		data.socket_id = socket.id;
  		incidencias_n1.push(data);
  		io.emit('post:incidencias:n1', incidencias_n1)
  	})

  	socket.on('connect:asistente:n1', function () {
  		io.emit('post:incidencias:n1', incidencias_n1)
  	})
  	socket.on('connect:asistente:n2', function () {
  		io.emit('post:incidencias:n2', incidencias_n2)
  	})
  	socket.on('connect:asistente:n3', function () {
  		io.emit('post:incidencias:n3', incidencias_n3)
  	})
  	socket.on('connect:gerencia', function () {
  		io.emit('post:incidencias:gerencia', incidencias_gerencia)
  	})

  	socket.on('resolve:asistente:n1', function (data) {
  		curr = _.find(incidencias_n1, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			return
  		}
  		console.log('Resolución en Nivel 1 para socket_id', curr.socket_id)
  		incidencias_n1 = _.filter(incidencias_n1, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:resolved', curr);
  		io.emit('post:incidencias:n1', incidencias_n1)
  	})
  	
  	socket.on('pass:asistente:n1', function (data) {
  		curr = _.find(incidencias_n1, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			io.emit('post:incidencias:n1', incidencias_n1)
  			io.emit('post:incidencias:n2', incidencias_n2)
  			return
  		}
  		console.log('Paso a Nivel 2 para socket_id', curr.socket_id)
  		incidencias_n1 = _.filter(incidencias_n1, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:pass:n2', curr);
  		incidencias_n2.push(curr);
  		io.emit('post:incidencias:n1', incidencias_n1)
  		io.emit('post:incidencias:n2', incidencias_n2)
  	})

  	socket.on('resolve:asistente:n2', function (data) {
  		curr = _.find(incidencias_n2, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			return
  		}
  		console.log('Resolución en Nivel 2 para socket_id', curr.socket_id)
  		incidencias_n2 = _.filter(incidencias_n2, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:resolved', curr);
  		io.emit('post:incidencias:n2', incidencias_n2)
  	})
  	
  	socket.on('pass:asistente:n2', function (data) {
  		curr = _.find(incidencias_n2, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			io.emit('post:incidencias:n2', incidencias_n2)
  			io.emit('post:incidencias:n3', incidencias_n3)
  			return
  		}
  		console.log('Paso a Nivel 2 para socket_id', curr.socket_id)
  		incidencias_n2 = _.filter(incidencias_n2, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:pass:n3', curr);
  		incidencias_n3.push(curr);
  		io.emit('post:incidencias:n2', incidencias_n2)
  		io.emit('post:incidencias:n3', incidencias_n3)
  	})

  	socket.on('resolve:asistente:n3', function (data) {
  		curr = _.find(incidencias_n3, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			io.emit('post:incidencias:n2', incidencias_n2)
  			io.emit('post:incidencias:n3', incidencias_n3)
  			return
  		}
  		console.log('Resolución 3 para socket_id', curr.socket_id)
  		incidencias_n3 = _.filter(incidencias_n3, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:resolved', curr);
  		io.emit('post:incidencias:n3', incidencias_n3)
  	})
  	
  	socket.on('pass:asistente:n3', function (data) {
  		curr = _.find(incidencias_n3, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			io.emit('post:incidencias:n1', incidencias_n1)
  			io.emit('post:incidencias:n2', incidencias_n2)
  			io.emit('post:incidencias:n3', incidencias_n3)
  			return
  		}
  		console.log('Paso a Gerencia para socket_id', curr.socket_id)
  		incidencias_n3 = _.filter(incidencias_n3, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:pass:gerencia', curr);
  		incidencias_gerencia.push(curr);
  		io.emit('post:incidencias:n3', incidencias_n3)
  		io.emit('post:incidencias:gerencia', incidencias_gerencia)
  	})

  	socket.on('resolve:gerencia', function (data) {
  		curr = _.find(incidencias_gerencia, function (e) {
  			return e.id == data.id
  		})
  		if(!curr){
  			io.emit('post:incidencias:n1', incidencias_n1)
  			io.emit('post:incidencias:n2', incidencias_n2)
  			io.emit('post:incidencias:n3', incidencias_n3)
  			return
  		}
  		console.log('Resolución en Gerencia para socket_id', curr.socket_id)
  		incidencias_gerencia = _.filter(incidencias_gerencia, function (e) {
  			return e.id != data.id
  		})
  		io.to(curr.socket_id).emit('incidencia:resolved', curr);
  		io.emit('post:incidencias:gerencia', incidencias_gerencia)
  	})
	
});