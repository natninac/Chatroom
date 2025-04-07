let express = require('express');
const portNumber =4200;
const app = express();

app.listen(portNumber, function () {
    console.log("Server is running on port "+portNumber);
  });

  app.get('/', requestHandler);

  app.use(express.static(__dirname + '/public'));

  function requestHandler(request,response){
    // send a default response to the client...
    response.send("HELLO WORLD");
    console.log(request.url);
    }

      //note how the route NEED not be the same as the page that will be served! 
  app.get('/chatroom',requestRootHandler);
 
  function requestRootHandler(request,response){
      response.sendFile(__dirname + '/public/test.html');
  }
