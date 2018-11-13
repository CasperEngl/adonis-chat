const User = use('App/Models/User');

const status = use('./status');

class LoginController {
  async index({ request, auth }) {
    try {
      const { email, password } = request.only(['email', 'password']);

      const tokens = await auth
        .withRefreshToken()
        .attempt(email, password);

      const {
        id,
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
      } = await User.findBy('email', email);

      return {
        success: true,
        user: {
          tokens: {
            token: tokens.token,
            refreshToken: tokens.refreshToken,
            type: tokens.type,
            createdAt: new Date().toISOString(),
          },
          account: {
            id,
            email: userEmail,
            firstName,
            lastName,
          },
        },
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

module.exports = LoginController;
