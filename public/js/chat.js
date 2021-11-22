const socket=io()
console.log("hiiiiiii")

const inputMessage=document.querySelector("#message-input")
const submitButton=document.querySelector("#submit-button")
const locationButton=document.querySelector("#location-button")
//template
const messages=document.querySelector("#messages")
const sideBar=document.querySelector("#side-bar")
const messageTemplate=document.querySelector("#message-template").innerHTML
const locationTemplate=document.querySelector("#location-template").innerHTML
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll = () => {
    // New message element
    const $newMessage = messages.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // Visible height
    const visibleHeight = messages.offsetHeight
    // Height of messages container
    const containerHeight = messages.scrollHeight
    // How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight
    if(Math.round(containerHeight - newMessageHeight-1) <= Math.round(scrollOffset)){
        messages.scrollTop = messages.scrollHeight;
    }
    }
socket.on("message",({text,createdAt,username})=>{
    const html=Mustache.render(messageTemplate,{message:text,
    createdAt:moment(createdAt).format('h:mm'),username})
    messages.insertAdjacentHTML('beforeend',html)
    inputMessage.value=''
    inputMessage.focus()
     autoscroll()
})

socket.on("locationMessage",({url,createdAt,username})=>{
    
    const html=Mustache.render(locationTemplate,{location:url,createdAt:moment(createdAt).format('h:mm'),username})
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
document.querySelector("form").addEventListener('submit',(e)=>{
   e.preventDefault()
     submitButton.setAttribute("disabled","disabled")

      socket.emit("send message",inputMessage.value,()=>{
          console.log("Message is delieverd")
          submitButton.removeAttribute("disabled")

      })
})
locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported')
    }
    locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position.coords)
        socket.emit("sendLocation",{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{
            console.log("Location is shared")
            locationButton.removeAttribute('disabled')
        })
    })
})
socket.emit('join',{username,room},(error)=>{
  console.log(error)
  alert(error)
  location.href="/"
})
socket.on('onlineUsers',({room,users})=>{
  console.log(room, users)
  const html=Mustache.render(sidebarTemplate,{room,users})
  sideBar.innerHTML=html
})
console.log(username,room)