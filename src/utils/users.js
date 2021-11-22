const users=[]


const addUser=({id,username,room})=>{
  //clean data
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
  //validate input
   if(!username||!room){
       const error={error:"username and room are required"}
       return error
   }
  
   //check existing user
   const existingUser=users.find(user=>{
       return username===user.username&&room===user.room
   })
  if(existingUser){
    return {
        error:'username is in use'
    }  
  }
  const user={id,username,room}
  users.push(user)
  return {user}
}
const removeUser=(id)=>{
    const userIndex=users.findIndex(user=>user.id===id)

    const removedUser=users.splice(userIndex,1)[0]
    return removedUser
}
const getUser=(id)=>{
  const user=users.find(user=>user.id===id)
  return user
}
const getUsersInRoom=(room)=>{
    const usersInRoom=users.filter(user=>user.room===room)
    return usersInRoom
}

module.exports={
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}
