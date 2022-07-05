const fs = require('fs');
const express =  require('express');
const app = express();
const puerto = 8080;
const path = require('path');
const { Server: IOServer } = require('socket.io');
const expressServer = app.listen(puerto, (error) => {
  if(error){
    console.log(`Se produjo un error ${error}`)
  }else{
    console.log(`Servidor escuchando puerto: ${puerto}`)
  }
})
const io = new IOServer(expressServer);
const messages = [];
const products = [];

app.use(express.static(path.join(__dirname, '/public')))

// función que guarda los mensajes
const saveMessages = async () => {
  try{
      await fs.promises.writeFile(path.join(__dirname,'/chat.txt'), JSON.stringify(messages))
      console.log('Mensaje guardado')
  }catch(error){
      console.log(`Se produjo un error ${error}, no se pudo guardar el mensaje`)
  }

}

// servidor
io.on('connection', socket => {
  console.log('Se conecto un usuario - ID:', socket.id)

  // PRODUCTOS!!!
  io.emit('server:productos', products) // renderizo los productos para todos los sokets

  socket.on('cliente:productos', data => {
    products.push(data) // recibo el producto del cliente y lo pusheo al arreglo para la persistencia en memoria 
    io.emit('server:productos', products) // emito el arreglo con los producots al cliente
  })

  // CHAT!!!
  io.emit('server:mensaje', messages) // renderizo los mensajes para todos los sokets

  socket.on('cliente:mensaje', data => {
    messages.push(data) // recibo el mensaje del cliente y lo pusheo al arreglo para la persistencia en memoria 
    saveMessages() // guardo los mensajes
    io.emit('server:mensajes', messages) // emito el arreglo con los mensajes al cliente
  })
})

