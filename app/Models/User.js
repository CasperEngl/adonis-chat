/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class User extends Model {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  /**
   * Hidden fields when retrieving the user
   *
   * @return {array}
   */
  static get hidden() {
    return ['password', 'is_verified'];
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  /**
   * Return the users conversations
   *
   * @method conversations
   *
   * @return {Object}
   */
  conversations() {
    return this.belongsToMany('App/Models/Conversation').pivotTable('conversation_user', 'conversation_id', 'user_id');
  }

  messages() {
    return this.hasMany('App/Models/Message', 'id', 'user_id');
  }
}

module.exports = User;
