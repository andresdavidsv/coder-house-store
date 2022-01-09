const form = document.querySelector('#chatForm');
const txtMsg = document.querySelector('#chatTxtMsg');
const messagesHtml = document.querySelector('#chatMsgs');
const numberCompresion = document.querySelector('#numberCompresion');
const userMail = document.querySelector('#userMail');

const userName = document.querySelector('#userName');
const userLastName = document.querySelector('#userLastName');
const userAge = document.querySelector('#userAge');
const userAlias = document.querySelector('#userAlias');
const userAvatar = document.querySelector('#userAvatar');

const schemaAutor = new normalizr.schema.Entity(
  'author',
  {},
  { idAttribute: 'email' }
);

const schemaMessage = new normalizr.schema.Entity(
  'post',
  { author: schemaAutor },
  { idAttribute: '_id' }
);

const schemaMessages = new normalizr.schema.Entity(
  'posts',
  { messages: [schemaMessage] },
  { idAttribute: 'id' }
);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMsg = txtMsg.value;
  const userMailValue = userMail.value;
  const userNameValue = userName.value;
  const userLastNameValue = userLastName.value;
  const userAgeValue = userAge.value;
  const userAliasValue = userAlias.value;
  const userAvatarValue = userAvatar.value;

  const re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (
    newMsg !== '' &&
    userMailValue !== '' &&
    userNameValue !== '' &&
    userLastNameValue !== '' &&
    userAgeValue !== '' &&
    userAliasValue !== '' &&
    userAvatarValue !== '' &&
    re.exec(userMailValue)
  ) {
    socket.emit('msg-to-server', {
      author: {
        email: userMailValue,
        name: userNameValue,
        lastName: userLastNameValue,
        age: userAgeValue,
        alias: userAliasValue,
        avatar: userAvatarValue,
      },
      message: newMsg,
    });
    form.reset();
  }
});

socket.on('msg-from-server', (data) => {
  const messages = normalizr.denormalize(
    data.normalizedData.result,
    schemaMessages,
    data.normalizedData.entities
  );
  if (data.status !== 'error' && messages.messages.length > 0) {
    numberCompresion.innerHTML = `<strong class="text-primary">(Compresion ${data.porcentage}%)</strong>`;
    let messagesPrint = messages.messages
      .map((chatMessages) => {
        const date = new Date(
          parseInt(chatMessages._id.toString().slice(0, 8), 16) * 1000
        ).toLocaleString();
        return `<li> <strong class="text-primary">${chatMessages.author.email}</strong> <span class="text-danger">[${date}]</span>: <span class="text-success fst-italic">${chatMessages.message}</span> <img src=${chatMessages.author.avatar} class="rounded-circle" alt=${chatMessages.author.name} height="50" width="50"></li>`;
      })
      .join('');
    messagesHtml.innerHTML = messagesPrint;
  } else if (!data.chatMessages.length > 0) {
    messagesHtml.innerHTML = `<h2><strong class="text-primary">No Messages</strong></h2>`;
  } else {
    messagesHtml.innerHTML = `<h2><strong class="text-primary">${data.message}</strong></h2>`;
  }
});
