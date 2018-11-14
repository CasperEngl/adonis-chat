const User = use('App/Models/User');

const status = use('./status');

class LoginController {
  async index({ request, auth, response }) {
    try {
      const { email, password } = request.only(['email', 'password']);

      const tokens = await auth
        .withRefreshToken()
        .attempt(email, password);

      const user = await User.query()
        .where('email', email)
        .where('is_verified', true)
        .first();

      response.status(200);

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
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
          },
        },
      };
    } catch (err) {
      console.error(err);

      response.status(401);

      return {
        success: false,
        message: status.unauthorized,
      };
    }
  }
}

module.exports = LoginController;
