const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

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
    const { email, password, user_name} = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await this.mongoDB.create(this.collection, {
      email,
      user_name,
      password: hashedPassword,
    });
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
