/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ConversationSchema extends Schema {
  up() {
    this.create('conversations', (table) => {
      table.increments();
      table.timestamps();
    });

    this.create('conversation_user', (table) => {
      table.increments('id');
      table.integer('conversation_id').unsigned().references('id').inTable('conversations');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('name');
      table.timestamps();
    });
  }

  down() {
    this.drop('conversation_user');
    this.drop('conversations');
  }
}

module.exports = ConversationSchema;
