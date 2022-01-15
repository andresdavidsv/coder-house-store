
const titles =
  {
    titleForm: 'Input Product',
    titleTable: 'Products',
    titleChat: 'Mini Chat',
    titleLogin: 'Login',
  }
;

exports.viewHome = async function (req, res) {
  res.render('index', { ...titles});
}

exports.viewLogin = async function (req, res) {
  const { user } = req.query;
  if (!user) {
    return res.send('Login failed');
  } else {
    req.session.user = user;

    res.render('index', {
      ...titles,
      messageLogin: 'Welcome',
      buttonLogout: 'LogOut',
      isLogin: true,
      user,
    });
  }
}

exports.viewLogout = async function (req, res) {
  const { user } = req.query;
  req.session.destroy((error) => {
    if (error) {
      return res.send({
        status: 'Logout error',
        message: error,
      });
    }

    return res.render('index', {
      ...titles,
      messageLogin: 'Good Bye',
      isLogin: false,
      user,
    });
  });
}