const { config } = require('../../config');

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.gmailAdmin,
    pass: config.passwordAdmin,
  },
});

module.exports = { transporter };
