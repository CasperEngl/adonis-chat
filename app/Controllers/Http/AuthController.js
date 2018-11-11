const User = use('App/Models/User');
const Token = use('App/Models/Token');

const Encryption = use('Encryption');

const status = use('./status');

class AuthController {
  async register({ request }) {
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

  async login({ request, auth }) {
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

  async verify({ auth }) {
    try {
      await auth.check();

      return {
        success: true,
        message: 'User authorized',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Missing or invalid jwt token',
      };
    }
  }

  async logout({ request }) {
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

  async refreshToken({ request, auth }) {
    try {
      const { refreshToken } = request.only(['refreshToken']);

      const tokens = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken);

      console.log(updatedTokens);

      return {
        success: true,
        user: {
          tokens: {
            token: tokens.token,
            refreshToken: tokens.refreshToken,
            type: tokens.type,
            createdAt: new Date().toISOString(),
          },
        }
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

module.exports = AuthController;
