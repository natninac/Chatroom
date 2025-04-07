//import the Express library
let express = require('express');
const portNumber = 4200;
let app = express(); //make an insatnce of express
let httpServer = require('http').createServer(app);  // create a server (using the Express framework object)
 
// declare io which mounts to our httpServer object (runs on top ... )
let io = require('socket.io')(httpServer);

let clientIdIncrementing =0;
let clientIds =[];

// for the client...
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

//io listens for the connection event for incoming sockets, and if one is connected
//will log it to the console....
io.on('connect', function(socket){
    //the socket id built in...
    console.log(socket.id);
    console.log('a user connected');
 
    socket.on('join', function (data) {
        clientIdIncrementing++;
       // send back the id
       socket.emit('joinedClientId', clientIdIncrementing);
       console.log('a new user with id ' + clientIdIncrementing + " has entered");
       //keep track of the ids
       clientIds.push({id:clientIdIncrementing,socketId:socket.id});
    });

   // when server receives this....
   socket.on('textData', function (data) {
    //send to everyone else
    console.log(data);
    socket.broadcast.emit("dataFromServer",data);
    //pass on

    document.querySelector("chatList").appendChild('textData');

  });



});


//default route
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});
 
// serve anything from this dir ...
app.use(express.static(__dirname + '/public'));
 
//make a route to test page...
app.get('/testPage', function(req, res) {
    res.sendFile(__dirname + '/public/test.html');
});




// make server listen for incoming messages
httpServer.listen(portNumber, function(){
  console.log('listening on port:: '+portNumber);

})