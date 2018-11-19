/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Conversation extends Model {
  static boot() {
    super.boot();
  }

  /**
   * Return the users belonging to this conversation
   *
   * @method users
   *
   * @return {Object}
   */
  users() {
    return this.belongsToMany('App/Models/User').pivotTable('conversation_user', 'user_id', 'conversation_id');
  }

  /**
   * Return all message in conversation
   *
   * @method messages
   *
   * @return {Object}
   */
  messages() {
    return this.hasMany('App/Models/Message');
  }

  /**
   * Checks if any new messages are sent
   * @param userId - filters out messages sent from user_id
   *
   * @return integer
   */
  seen(userId = 0) {
    return this
      .messages
      .where('seen', true)
      .where('user_id', '!=', userId)
      .count();
  }
}

module.exports = Conversation;
