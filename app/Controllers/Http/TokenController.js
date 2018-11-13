const status = use('./status');

class TokenController {
  async refresh({ request, auth }) {
    try {
      const { refreshToken } = request.only(['refreshToken']);

      const tokens = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken);

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

      return {
        success: false,
        message: status.serverError,
      };
    }
  }
}

module.exports = TokenController;
