var app = angular.module('simpleAngular', []);

// Connect to socket.io
var socket = io.connect('http://127.0.0.1:5000');






app.controller('main', function() {
  
  var vm = this;

  vm.chats = [];

  	// Status messages
  	socket.on('status', function(data){
    	console.log(data);	

    });
    // Handle Output
    socket.on('output', function(data){
      console.log(data); // ovo uradi
      vm.chats.push(data);
    });

    socket.on('input', function(data){
    		console.log(data);
    });



});




