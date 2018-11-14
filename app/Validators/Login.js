class Login {
  get rules() {
    return {
      email: 'required|email',
      password: 'required',
    };
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email',
    };
  }
}

module.exports = Login;
