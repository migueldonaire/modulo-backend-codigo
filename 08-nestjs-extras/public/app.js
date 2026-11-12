// Se conecta al servidor (el mismo que ha servido esta página)
const socket = io();

// Cuando el servidor avise de un libro nuevo, lo añadimos a la lista
socket.on('book-created', (book) => {
  const li = document.createElement('li');
  li.textContent = `${book.title} (${book.author})`;
  document.querySelector('#books').append(li);
});

// Cuando llegue un mensaje del chat, lo mostramos
socket.on('chat', (text) => {
  const li = document.createElement('li');
  li.textContent = text;
  document.querySelector('#messages').append(li);
});

// Al enviar el formulario, mandamos el mensaje al servidor
document.querySelector('#chat-form').addEventListener('submit', (event) => {
  event.preventDefault(); // que no recargue la página
  const input = document.querySelector('#chat-text');
  socket.emit('chat', input.value);
  input.value = '';
});
