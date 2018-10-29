// connecting with sockets.
const socket = io('http://localhost:3000');

let chatMessage = {
  createdOn: Date.now(),
  room: "GlobalRoom"
}


let chatSocket = () => {
  $("#joinRoom").on('click', function () {
    chatMessage.senderName = $("#joineeName").val();
    socket.emit('join', chatMessage);
    $("#joineeName").val("");
  })

  socket.on('new user joined', (chatMessage)=>{
    console.log(chatMessage.senderName + " joined the group.");
  })

  socket.on('group-message', (chatMessage)=>{
    console.log(chatMessage.senderName + " says " + chatMessage.message);
    $("#messageToSend").val("") 
  })


    $("#send").on('click', function () {
      chatMessage.message = $("#messageToSend").val();
      socket.emit("chat-msg",chatMessage);
    })

}// end chat socket function

chatSocket();
