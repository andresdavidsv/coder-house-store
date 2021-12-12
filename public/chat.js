const form = document.querySelector('#chatForm');
const txtMsg = document.querySelector('#chatTxtMsg');
const messages = document.querySelector('#chatMsgs');
const user = document.querySelector('#userName');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMsg = txtMsg.value;
  const userMail = user.value;
  re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (newMsg !== '' && userMail !== '' && re.exec(userMail)) {
    socket.emit('msg-to-server', {
      user: userMail,
      messsage: newMsg,
    });
  }
});
socket.on('msg-from-server', (data) => {
  if (data.status !== 'error' && data.chatMessages.length > 0) {
    let messagesPrint = data.chatMessages
      .map((chatMessages) => {
        return `<li> <strong class="text-primary">${chatMessages.user}</strong> <span class="text-danger">${chatMessages.created_at}</span>: <span class="text-success fst-italic">${chatMessages.messsage}</span></li>`;
      })
      .join('');
    messages.innerHTML = messagesPrint;
  } else if (!data.chatMessages.length > 0) {
    messages.innerHTML = `<h2><strong class="text-primary">No Messages</strong></h2>`;
  } else {
    messages.innerHTML = `<h2><strong class="text-primary">${data.message}</strong></h2>`;
  }
});
