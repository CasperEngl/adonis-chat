const User = use('App/Models/User');

const Mail = use('Mail');
const randomstring = use('randomstring');
const capitalize = use('capitalize');
const validator = use('validator');

const status = use('./status');

class RegisterController {
  async index({ request, response }) {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
      } = request.only(['email', 'firstName', 'lastName', 'password']);

      const nameCheck = [
        validator.isAlpha(firstName),
        validator.isAlpha(lastName),
      ]

      if (nameCheck.includes(false)) {
        response.status(400);

        return {
          message: status.badRequest,
        }
      }

      const user = await User.create({
        email,
        first_name: capitalize(firstName.trim()),
        last_name: capitalize(lastName.trim()),
        password,
        verification_token: randomstring.generate(40),
      });

      const mail = await Mail.send('emails.welcome', {
        user: user.toJSON(),
      }, (message) => {
        message
          .to(user.email)
          .from('system@chat.casperengelmann.com', 'Chat App')
          .subject('Welcome to Chat App');
      });

      response.status(200);

      return {
        success: true,
        message: 'User registered',
        mail,
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

module.exports = RegisterController;
