$(function() {
  var socket = io();
  // Socket events
	var $cont = $("#incidencias-n3")
	socket.on('connect', function () {
		socket.emit('connect:asistente:n3')
	})
	socket.on('reconnect', function () {
		socket.emit('connect:asistente:n3')
	})


  socket.on('post:incidencias:n3', function (incidencias_n3) {
  	$cont.empty();
	incidencias_n3.forEach(function (e) {
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
		$('<button/>').addClass('pasar-nivel-4').text('Pasar a Gerencia').appendTo($row);
		$row.appendTo($cont);
	})
  })

  $('#incidencias-n3').on('click', '.resolver', function (e) {
  	var id = $(e.target).closest('[data-incidencia-id]').attr('data-incidencia-id');
  	socket.emit('resolve:asistente:n3', {
  		'id': id
  	})
  })
  $('#incidencias-n3').on('click', '.pasar-nivel-4', function (e) {
  	var id = $(e.target).closest('[data-incidencia-id]').attr('data-incidencia-id');
  	socket.emit('pass:asistente:n3', {
  		'id': id
  	})
  })
});