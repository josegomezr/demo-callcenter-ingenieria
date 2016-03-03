
$(function() {
  var socket = io();
  // Socket events
	var $cont = $("#incidencias-n1")
	socket.on('connect', function () {
		socket.emit('connect:asistente:n1')
	})
	socket.on('reconnect', function () {
		socket.emit('connect:asistente:n1')
	})
  

  socket.on('post:incidencias:n1', function (incidencias_n1) {
  	$cont.empty();
	incidencias_n1.forEach(function (e) {
		var date = new Date(e.time)
		var $row = $('<div/>');
		$row.attr('data-incidencia-id', e.id);
		$('<span/>').text([date.getDay(), date.getMonth(), date.getFullYear()].join('-')).appendTo($row);
		$row.append(' | ')
		$('<span/>').text([date.getHours(), date.getMinutes(), date.getSeconds()].join(':')).appendTo($row);
		$row.append(' | ')
		$('<span/>').text('Incidencia No.').appendTo($row);
		$('<span/>').text(e.id).appendTo($row);
		$row.append(' | ')
		$('<button/>').addClass('resolver').text('Resolver Incidencia').appendTo($row);
		$row.append(' | ')
		$('<button/>').addClass('pasar-nivel-2').text('Pasar a Nivel 2').appendTo($row);
		$row.appendTo($cont);
	})
  })

  $('#incidencias-n1').on('click', '.resolver', function (e) {
  	var id = $(e.target).closest('[data-incidencia-id]').attr('data-incidencia-id');
  	socket.emit('resolve:asistente:n1', {
  		'id': id
  	})
  })
  $('#incidencias-n1').on('click', '.pasar-nivel-2', function (e) {
  	var id = $(e.target).closest('[data-incidencia-id]').attr('data-incidencia-id');
  	socket.emit('pass:asistente:n1', {
  		'id': id
  	})
  })
});