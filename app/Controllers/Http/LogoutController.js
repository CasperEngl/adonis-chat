const Token = use('App/Models/Token');

const Encryption = use('Encryption');

const status = use('./status');

class LogoutController {
  async index({ request }) {
    try {
      const { refreshToken } = request.only(['refreshToken']);

      const decrypted = Encryption.decrypt(refreshToken);
      const dbRefreshToken = await Token.findBy('token', decrypted);

      dbRefreshToken.is_revoked = true;

      await dbRefreshToken.save();

      return {
        success: true,
        message: 'You are now logged out',
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

module.exports = LogoutController;
