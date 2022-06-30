const fs = require('fs');
const express =  require('express');
const app = express();
const puerto = 8080;
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static(path.join(__dirname,'/public')))

httpServer.listen(puerto, (error)=>{
  if(error){
    console.log(`Se produjo un error ${error}`)
  }else{
    console.log(`Servidor escuchando puerto: ${puerto}`)
  }
})

const messages = [];
const products = [];

const saveChat = async () => {
  try{
    await fs.promises.writeFile(path.join(__dirname,'/chat'), JSON.stringify(messages))
    console.log('mensajes guardados')
  }catch(error){
    console.log(`Se produjo un error ${error}`)
  }
}

io.on('connection',  async socket =>{
  console.log('se conecto un usuario - ID:', socket.id)

  io.emit('serverSend:Products', products)

  socket.on('client:enterProduct', dataProduct=>{
    products.push(dataProduct)
    io.emit('serverSend:Products', products)
  })

  io.emit('serverSend:message', messages)

  socket.on('client:message', dataMessage=>{
    messages.push(dataMessage)
    saveChat()
    io.emit('serverSend:message', messages)
  })
})