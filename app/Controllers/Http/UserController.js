const User = use('App/Models/User');

const status = use('./status');

class UserController {
  async index() {
    try {
      let users = await User.all();

      users = users.rows.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      }));

      return {
        success: true,
        users,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: status.serverError,
      };
    }
  }
}

module.exports = UserController;
