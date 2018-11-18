/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Message extends Model {
  static boot() {
    super.boot();
  }

  user() {
    this.hasOne('App/Models/User', 'id', 'user_id');
  }
}

module.exports = Message;
