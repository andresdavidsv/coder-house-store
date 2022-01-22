const registerForm = document.querySelector('#registerForm');
const userNameForm = document.querySelector('#userName');
const userEmailForm = document.querySelector('#userEmail');
const userPasswordForm = document.querySelector('#userPassword');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = userNameForm.value;
  const email = userEmailForm.value;
  const password = userPasswordForm.value;

  const user = {
    user_name: name,
    email,
    password,
  };
  fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message !== 'user already exists') {
        window.location.href = '/logged?user=' + data.data;
      }
      window.location.href = '/login?user=' + data.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = 'failregister';
      }
    });
});

