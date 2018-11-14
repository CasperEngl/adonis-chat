const User = use('App/Models/User');

const status = use('./status');

class TokenController {
  async refresh({ request, response, auth }) {
    try {
      const { refreshToken } = request.only(['refreshToken']);

      const tokens = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken);


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

  async verifyEmail({ params, response }) {
    try {
      const { token } = params;

      const user = await User.findByOrFail('verification_token', token);

      user.is_verified = true;
      user.verification_token = '';

      await user.save();

      return response.route('home');
    } catch (err) {
      console.error(err);

      response.status(401);

      return response.route('error', {
        errorCode: 401,
      });
    }
  }
}

module.exports = TokenController;
