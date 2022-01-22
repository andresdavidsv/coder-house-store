const loginForm = document.querySelector('#loginForm');
const userEmailFormLogin = document.querySelector('#userEmailLogin');
const userPasswordFormLogin = document.querySelector('#userPasswordLogin');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = userEmailFormLogin.value;
  const password = userPasswordFormLogin.value;
  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + btoa(email + ':' + password));
  fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = '/logged?user=' + data.user.user_name;
    })
    .catch((error) => {
      if (error) {
        window.location.href = 'faillogin';
      }
    });
});
