/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MessageSchema extends Schema {
  up() {
    this.create('messages', (table) => {
      table.increments();
      table.integer('conversation_id').notNullable();
      table.integer('user_id').notNullable();
      table.text('content').notNullable();
      table.boolean('new').default(true);
      table.boolean('is_deleted').default(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('messages');
  }
}

module.exports = MessageSchema;
