const socket = io();

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

const getMessage = () => {
  try{
    const email = inputEmail.value;
    const message = inputMessage.value;
    const timeChat = `${date},${hour}`
    socket.emit('client:message', { email , timeChat, message })

  }catch(error){
    console.log(`Se produjo un error ${error}`)
  }
}

const renderMessages = (arr) => {
  try{
    const html = arr.map(message =>{
      return(`
        <div>
          <strong style="color: blue;">${message.email}</strong>
          <span style="color: brown;">${date}, ${hour}</span>
          <em style="color: green; font-style: italic;">${message.message}</em>
        </div>
      `)
    })
    allMessages.innerHTML = html
  }catch(error){
    console.log(`Se produjo un error ${error}`)
  }
}

formChat.addEventListener('submit', event =>{
  event.preventDefault()
  getMessage()
  inputMessage.value = ""
})

socket.on('serverSend:message', renderMessages)

// productos
const formProducts = document.querySelector('#formProducts');
const inputTitle = document.querySelector('#title');
const inputPrice = document.querySelector('#price');
const inputThumbnail = document.querySelector('#thumbnail');
const productTable = document.querySelector('#productTable');

const getProduct = () => {
  try{
    const title = inputTitle.value;
    const price = inputPrice.value;
    const thumbnail = inputThumbnail.value;
    socket.emit('client: enterProduct', {title, price, thumbnail})
  }catch(error){
    console.log(`Se produjo un error ${error}`)
  }
}

const renderProducts = async (arr) => {
  try{
    const response = await fetch('/plantilla.hbs')
    const plantilla = await response.text() 
    if(arr.length > 0){
      document.querySelector('#noProducts').innerHTML = ""
      document.querySelector('#productTable').innerHTML = ""
      arr.forEach(product => {
        const template = Handlebars.compile(plantilla);
        const templateFilled = template(product);
        document.querySelector('#productTable').innerHTML += templateFilled
      });

    }else{
      document.querySelector('#noProducts').innerHTML = ( "<h3>No hay productos</h3>" )
    }
  }catch(error){
    console.log(`Se produjo un error ${error}`)
  }
}

formProducts.addEventListener('submit', event => {
  event.preventDefault()
  getProduct()
  formProducts.value = "" 
})

socket.on('serverSend:Products', products=>{
    renderProducts(products)
});