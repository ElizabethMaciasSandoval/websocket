const socket = io();

// PRODUCTOS!!!

// productos
const formProducts = document.querySelector('#formProducts');
const inputTitle = document.querySelector('#title');
const inputPrice = document.querySelector('#price');
const inputThumbnail = document.querySelector('#thumbnail');
const productTable = document.querySelector('#productTable');

// evento
formProducts.addEventListener('submit', event =>{
  event.preventDefault() 
  const title = inputTitle.value;
  const price = inputPrice.value;
  const thumbnail = inputThumbnail.value;
  socket.emit('cliente:productos', { title, price, thumbnail})
})

const renderProducts = async (arrayProducts) => {
  const response = await fetch('./plantilla.hbs');
  const plantilla = await response.text();
  console.log(arrayProducts)
  try {
    if (arrayProducts.length > 0) {
      document.querySelector('#noProducts').innerHTML="" 
      document.querySelector('#productTable').innerHTML="" 
      arrayProducts.forEach(product => {
        const template = Handlebars.compile(plantilla)
        const filled = template(product) 
        productTable.innerHTML += filled 
    })
    } else {
      productTable.innerHTML = ("<h4>No hay ninguna producto </h4>")
    }
  } catch (error) {
    console.log(`Se produjo un error ${error}`)
  }
}

socket.on('server:productos', data => {
  console.log(data)
  renderProducts(data)
})

// CHAT!!!

// fecha
const timer = Date.now();
const day = new Date(timer);
const date = day.toLocaleDateString();

// hora
const time = new Date();
const hour = time.toLocaleTimeString('it-IT');

// chat
const formChat = document.querySelector('#formChat');
const inputEmail = document.querySelector('#email');
const inputMessage = document.querySelector('#message');
const allMessages = document.querySelector('#messages');

// evento
formChat.addEventListener('submit', event => {
  event.preventDefault()
  const email = inputEmail.value;
  const message = inputMessage.value;
  const timeChat = `${date},${hour}`
  socket.emit('cliente:mensaje', { email , timeChat, message })
})

// recibo mensajes del servidor y los renderizo en el html
socket.on('server:mensajes', data =>{
  allMessages.innerHTML = ''
  data.forEach(message => {
    allMessages.innerHTML += `
    <div>
      <strong style="color: blue;">${message.email}</strong>
      <span style="color: brown;">${date}, ${hour}</span>
      <em style="color: green; font-style: italic;">${message.message}</em>
    </div>
  `
  })
})
