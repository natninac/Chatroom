window.onload=function(){
    console.log("client js loaded");
    const draggableElements = document.querySelectorAll(".draggable");
      console.log("Found draggable elements:", draggableElements.length);
    
      draggableElements.forEach(function(elmnt) {
        elmnt.addEventListener("mousedown", dragMouseDown);
      });
  
      function dragMouseDown(e) {
        e.preventDefault();
        const elmnt = this;
        console.log("drag element:", elmnt.id);

        let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;
      if (getComputedStyle(elmnt).position !== "absolute") {
        const rect = elmnt.getBoundingClientRect();
        elmnt.style.position = "absolute";
        elmnt.style.top = rect.top + "px";
        elmnt.style.left = rect.left + "px";
      }
      elmnt.style.zIndex = "1000";
          
      document.addEventListener("mousemove", elementDrag);
      document.addEventListener("mouseup", closeDragElement);
      
      function elementDrag(e) {
        e.preventDefault();
        //calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
      
      function closeDragElement() {
      
        document.removeEventListener("mousemove", elementDrag);
        document.removeEventListener("mouseup", closeDragElement);
      }
    }
  
    //set up the client socket to connect to the socket.io server
let io_socket = io();
let clientSocket = io_socket.connect('http://localhost:4200');


let socketId =-1;
let username = null;
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

      clientSocket.on('new user', function (name) {
        const liitem = document.createElement("li");
        liitem.textContent = `✋ ${name} has joined the chat!`;
        document.querySelector("#chatList").appendChild(liitem);
      });


      document.querySelector("#sub").addEventListener("click", function (event) {
        event.preventDefault();
        let myMessage = document.querySelector("#message").value;
        let userNameInput = document.querySelector("#username").value.trim();
        if (!myMessage || !userNameInput) {
          alert("please enter both a username and a message!");
          return;
        }

        let dataToSend = {data:myMessage, id:socketId, username: username,};
        clientSocket.emit("textData", dataToSend);
       let liitem = document.createElement("li");
       liitem.style = "list"
       liitem.textContent = `${userNameInput} (${socketId}): ${myMessage}`;
       document.querySelector("#chatList").appendChild(liitem);
        document.querySelector("#message").value ="";

        console.log(myMessage);
      });

  });
  


    
      

  const usernameForm = document.querySelector(".username-form");
  if (usernameForm) {
    const createUserBtn = document.querySelector("#create-user-btn");
    if (createUserBtn) {
      createUserBtn.addEventListener("click", function(e) {
        e.preventDefault();
        let input = document.querySelector("#username-input").value;
        if (input.length > 0) {
          username = input;
          clientSocket.emit('new user', username);
          usernameForm.remove();
        }
      });
    }
  }
};