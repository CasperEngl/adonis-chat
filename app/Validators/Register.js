class Register {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
      firstName: 'required',
      lastName: 'required',
      password: 'required',
    };
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email',
    };
  }
}

module.exports = Register;
