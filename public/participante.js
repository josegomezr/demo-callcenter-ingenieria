$(function() {
  var socket = io();
  // Socket events
  $("#registrar-incidencia").on('click', function (e) {
  	socket.emit('incidencia:n1', {
  		time: Date.now()
  	});
  	$(e.target).attr('disabled', 'disabled')
  })

  socket.on('incidencia:resolved', function (incidencias_n1) {
  	alert('resuelta!')
  	$("#registrar-incidencia").removeAttr('disabled')
  })
  socket.on('incidencia:pass:n2', function (incidencias_n1) {
  	alert('paso a nivel 2')
  })
  socket.on('incidencia:pass:n3', function (incidencias_n1) {
  	alert('paso a nivel 3')
  })
  socket.on('incidencia:pass:gerencia', function (incidencias_n1) {
  	alert('paso a gerencia')
  })
});