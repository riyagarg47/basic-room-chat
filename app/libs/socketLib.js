const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const ChatModel = mongoose.model('Chat');

let setServer = (server) => {
    let io = socketio.listen(server);
    let myIo = io.of('')
    myIo.on('connection', (socket) => {

         console.log("connection is established.");
         socket.room = 'GlobalRoom'

    socket.on('join', (data) => {
        socket.join(data.room);
        console.log(data.senderName + " joined the room " + data.room);
        socket.to(data.room).broadcast.emit('new user joined', data)
        
    })

        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            data['chatId'] = shortid.generate()
            console.log(data);
            
            setTimeout(function () {
                eventEmitter.emit('save-chat', data);
            }, 2000)
            myIo.in(data.room).emit('group-message',data)
        });
    });
}

eventEmitter.on('save-chat', (data) => {
    let newChat = new ChatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    });
    newChat.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });
}); // end of saving chat.

module.exports = {
    setServer: setServer
}



