const Lib = require('../lib');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.persistenceDb = new Lib();
  }

  async getUsers({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const users = await this.persistenceDb.getAll(this.collection, query);
    return users || [];
  }

  async getUserId({ userId }) {
    const user = await this.persistenceDb.get(this.collection, userId);
    return user || {};
  }

  async getUserName({ user_name }) {
    const [user] = await this.persistenceDb.getAll(this.collection, { user_name });
    return user;
  }
  async getUser({ email }) {
    const [user] = await this.persistenceDb.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { email, password, user_name} = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await this.persistenceDb.create(this.collection, {
      email,
      user_name,
      password: hashedPassword,
    });
    return createUserId;
  }

  async updateUser({ userId, user } = {}) {
    const updateUserId = await this.persistenceDb.update(
      this.collection,
      userId,
      user
    );
    return updateUserId;
  }

  async deleteUser({ userId }) {
    const deleteUserId = await this.persistenceDb.delete(this.collection, userId);
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
