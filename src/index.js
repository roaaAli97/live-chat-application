const express=require("express")
const path=require("path")
const http=require("http")
const app=  express()
const socketio=require("socket.io")
const directoryPath=path.join(__dirname,"../public")
const  {generateMessages,generateLocationMessages}=require("./utils/messages")
const {addUser,removeUser,getUser,getUsersInRoom}=require("./utils/users")
const server=http.createServer(app)
const io=socketio(server)
console.log(directoryPath)
app.use(express.static(directoryPath))
io.on('connection',(socket)=>{
    
    console.log("Client is connected")
   socket.on('join',({username,room},callback)=>{
         console.log(room)
        const {error,user}= addUser({id:socket.id,username,room})
        console.log(user)
        if(error){
            return callback(error)
        }
      socket.join(room)
      socket.emit("message",generateMessages('Admin','Welcome'))
      socket.broadcast.to(room).emit("message",generateMessages(`${user.username} has joined the chat`))
      io.to(user.room).emit('onlineUsers',{room:user.room,users:getUsersInRoom(user.room)})
   })
   
    socket.on("send message",(message,callback)=>{
        const user=getUser(socket.id)
        
        io.to(user.room).emit("message",generateMessages(user.username,message))
        callback()
    })
    socket.on("sendLocation",({latitude,longitude},callback)=>{
        const user=getUser(socket.id)
      io.to(user.room).emit("locationMessage",generateLocationMessages(`https://www.google.com/maps/@${latitude},${longitude}`,user.username))
      callback()
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            console.log('remove',user)
            io.to(user.room).emit("message",generateMessages('Admin',`${user.username} has left the chat`))
            io.to(user.room).emit('onlineUsers',{room:user.room,users:getUsersInRoom(user.room)})
        }
      
    })
})
const port=process.env.PORT||3000
server.listen(port,()=>{
    console.log("Serving is running on "+port)
})