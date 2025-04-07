window.onload=function(){
    console.log("client js loaded");

    

    //set up the client socket to connect to the socket.io server
let io_socket = io();
let clientSocket = io_socket.connect('http://localhost:4200');

let socketId =-1;
 clientSocket.on('connect', function(data) {
      console.log("connected");
      // put code here that should only execute once the client is connected
clientSocket.emit('join', 'msg:: client joined');
      // handler for receiving client id
      clientSocket.on("joinedClientId", function(data){
        socketId = data;
        console.log("myId "+socketId);
      });

      clientSocket.on("dataFromServer", function (incomingData) {
        console.log(incomingData.data);
   
        let liitem = document.createElement("li");
        liitem.style = "list";
        liitem.textContent = "user id:: " +incomingData.id +"   ----" +" message:: " +incomingData.data;
        
      });



      document.querySelector("#sub").addEventListener("click", function (event) {
        event.preventDefault();
        let myMessage = document.querySelector("#message").value;

        let dataToSend = {data:myMessage, id:socketId};
        clientSocket.emit("textData", dataToSend);
       let liitem = document.createElement("li");
       liitem.style = "list"
       liitem.textContent = "user id:: "+socketId +"   ----"+" message:: "+myMessage;
       document.querySelector("#chatList").appendChild(liitem);
        document.querySelector("#message").value ="";

        console.log(myMessage);
      });

  });
}