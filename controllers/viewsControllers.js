const { fork } = require('child_process');
const numCPUs = require('os').cpus().length;

const titles = {
  titleForm: 'Input Product',
  titleTable: 'Products',
  titleChat: 'Mini Chat',
  titleLogin: 'Login',
};
exports.viewHome = async function (req, res) {
  res.render('index', { ...titles });
};

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
};

exports.viewLogout = async function (req, res) {
  const { user } = req.query;
  req.session.destroy((error) => {
    if (error) {
      return res.send({
        status: 'Logout error',
        message: error,
      });
    }

    res.render('index', {
      ...titles,
      messageLogin: 'Good Bye',
      isLogin: false,
      user,
    });
  });
};

exports.viewRegister = async function (req, res) {
  res.render('register', {
    title: 'Register',
  });
};

exports.viewFailRegister = async function (req, res) {
  res.render('failsignup');
};

exports.viewLoginUser = async function (req, res) {
  const { user } = req.query;
  res.render('login', {
    title: 'Login',
    user,
  });
};

exports.viewFailLogin = async function (req, res) {
  res.render('faillogin');
};

exports.viewInfo = async function (req, res) {
  res.json({
    argEntrada: process.argv,
    os: process.platform,
    nodeVs: process.version,
    memoryUsage: JSON.stringify(process.memoryUsage()),
    excPath: process.execPath,
    processID: process.pid,
    folder: process.cwd(),
    numCPUs,
  });
};

exports.viewNumberRandom = async function (req, res) {
  const randomNumber = fork('./child.js');
  randomNumber.send(req.query);
  randomNumber.on('message', (numerosRandom) => {
    res.end(`Numeros random ${JSON.stringify(numerosRandom)}`);
  });
};
