 (function(){
            var element = function(id){
                return document.getElementById(id);
            }

            // Get Elements
            var status = element('status');
            var messages = element('messages');
            var textarea = element('textarea');
            var username = element('username');
            var enter = element('enter');
            var message;
        
            // Set default status
            var statusDefault = status.textContent;

            var setStatus = function(s){
                // Set status
                status.textContent = s;

                if(s !== statusDefault){
                    var delay = setTimeout(function(){
                        setStatus(statusDefault);
                    }, 2000);
                }
            }

            // Connect to socket.io
            var socket = io.connect('http://127.0.0.1:5000');

            // Check for connection
            if(socket !== undefined){
                console.log('Connected to socket...');

                // Handle Output
                socket.on('output', function(data){

                    message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.innerHTML = "<span class=\"badge badge-primary\">"+data.name+"&nbsp;:</span>&nbsp;"+data.message;
                    messages.appendChild(message);
                });

                // Get Status From Server
                socket.on('status', function(data){
                    // get message status
                    setStatus((typeof data === 'object')? data.message : data);
                    
                    //  if(data.clear) {
                    //     textarea.value = '';
                    //  }

                });

                // Events
                socket.on('event', function(data){
                    message = document.createElement('div');
                    message.setAttribute('class', 'event-message');
                    message.innerHTML = "<span class=\"badge badge-warning\">"+data.user+data.event+"&nbsp;</span>";
                    messages.appendChild(message);
                  
                });



                // Handle Input
                textarea.addEventListener('keydown', function(event){
                    if(event.which === 13 && event.shiftKey == false){

                        let sender = username.value;
                        sender ? sender : sender='anonymous';

                        // Emit to server input
                        socket.emit('input', {
                            name:sender,
                            message:textarea.value
                        });

                        event.preventDefault();
                        textarea.value = '';

                    }
                });


                  // Handle Chat Clear
                enter.addEventListener('click', function(){

                    let newusr = username.value;
                    newusr ? newusr : newusr='anonymous';

                       socket.emit('event', {
                            user:newusr,
                            event:' has joined chat.'
                        });
                });

              
            }

        })();