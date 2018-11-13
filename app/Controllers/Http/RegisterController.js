const User = use('App/Models/User');

const status = use('./status');

class RegisterController {
  async index({ request }) {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
      } = request.only(['email', 'firstName', 'lastName', 'password']);

      await User.create({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      return {
        success: true,
        message: 'User registered',
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

module.exports = RegisterController;
