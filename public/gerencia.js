$(function() {
  var socket = io();
  // Socket events
	var $cont = $("#incidencias-gerencia")
	socket.on('connect', function () {
		socket.emit('connect:gerencia')
	})
	socket.on('reconnect', function () {
		socket.emit('connect:gerencia')
	})


  socket.on('post:incidencias:gerencia', function (incidencias_gerencia) {
  	$cont.empty();
	incidencias_gerencia.forEach(function (e) {
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
		$row.appendTo($cont);
	})
  })

  $('#incidencias-gerencia').on('click', '.resolver', function (e) {
  	var id = $(e.target).closest('[data-incidencia-id]').attr('data-incidencia-id');
  	socket.emit('resolve:gerencia', {
  		'id': id
  	})
  })
});