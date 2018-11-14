/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Message extends Model {
  static boot() {
    super.boot();
  }

  owner() {
    this.hasOne('User', 'user_id');
  }
}

module.exports = Message;
