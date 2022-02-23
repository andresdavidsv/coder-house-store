const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');
const Avatar = require('avatar-builder').default;
const avatar = Avatar.catBuilder(128);
const { transporter } = require('../utils/emails/transporter');
const { config } = require('../config');
const debug = require('debug')('app:db');

const fs = require('fs');

if (!fs.existsSync('./tmp')) {
  fs.mkdirSync('./tmp', { recursive: true });
}

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUsers({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const users = await this.mongoDB.getAll(this.collection, query);
    return users || [];
  }

  async getUserId({ userId }) {
    const user = await this.mongoDB.get(this.collection, userId);
    return user || {};
  }

  async getUserName({ user_name }) {
    const [user] = await this.mongoDB.getAll(this.collection, { user_name });
    return user;
  }
  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { address, age, phone, user_name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    avatar.create(user_name).then((buffer) => {
      fs.writeFileSync(`public/avatars/${user_name}-avatar.png`, buffer);
    });

    const createUserId = await this.mongoDB.create(this.collection, {
      address,
      age,
      phone,
      user_name,
      email,
      avatar: `${user_name}-avatar.png`,
      password: hashedPassword,
    });

    try {
      await transporter.sendMail({
        from: '"Coder App 👻" <andres@coder.com>',
        to: `${config.gmailAdmin}`,
        subject: `New Register`,
        text: 'New Account successfully registered',
        html: `<h1>Hello admin, the user ${user_name} was register</h1>
              <h2>User Data:</h2>
              <span>Email: ${email} </span><br>
              <span>Address: ${address} </span><br>
              <span>Phone: ${phone} </span><br>
              <span>Age: ${age} </span><br>
              <span>Avatar: ${user_name}-avatar.png </span>
      `,
      });
    } catch (error) {
      debug(error);
    }

    return createUserId;
  }

  async updateUser({ userId, user } = {}) {
    const updateUserId = await this.mongoDB.update(
      this.collection,
      userId,
      user
    );
    return updateUserId;
  }

  async deleteUser({ userId }) {
    const deleteUserId = await this.mongoDB.delete(this.collection, userId);
    return deleteUserId;
  }

  async getOrCreateUser({ user }) {
    const queriedUser = await this.getUser({ email: user.email });

    if (queriedUser) {
      return queriedUser;
    }

    await this.createUser({ user });
    return await this.getUser({ email: user.email });
  }
}

module.exports = UsersService;
