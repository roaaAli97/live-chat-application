const generateMessages=(username,text)=>{
  return {
      username,
      text,
      createdAt:new Date().getTime()
  }
}
const generateLocationMessages=(url,username)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports= {
    generateMessages,
    generateLocationMessages
    
}
