const app  = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

const keys = require('./config/keys');
const message = require('./model/message');


// Connecting Mongo DB

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
mongoose.connection.on('error', ()=> {
  console.log("Error in database connection");
});

mongoose.connection.once('open', function() {
  console.log("DB connection established");
});



// Setting up Socket.io
io.on("connection", function(socket) {
  console.log("Socket connection established with ID: "+ socket.id);

    sendStatus = function(status){
            socket.emit('status', status);
    }

    registerUser = function(usr, pwd) {

      users.insert({name: usr, password: pwd}, function(){

                // Send status object
                  sendStatus({
                    message: 'Username registered!',
                    clear: true,
                    class: 'success'
                  });

            });

        }



    socket.on("input", async function(chat){
        let usr = chat.user;
        let msg = chat.message;

        if(msg == ''){
            // Send error status
            sendStatus({
              message: 'Please enter a message',
              clear:true,
              class: 'danger'
            });
        }

         // handle user registration
        if(msg.startsWith("register:")) {
          let pwd = msg.replace(/register:/g,'');
          // dodati hash
          registerUser(usr, pwd);
          
        } else {
          // output message
             chat.created = new Date();
             let response = await new message(chat).save();
             socket.emit("output", chat);

            sendStatus({
              message:'Message sent',
              clear:true,
              class:'success'

            });
        }

    });


    //message.find();
    //console.log(message);
    //socket.emit("output", message);

});



server.listen(5000, ()=> {
  console.log("Mongo socket chat running at port: 5000");
});
