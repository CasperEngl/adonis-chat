/*
|--------------------------------------------------------------------------
| ConversationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class ConversationSeeder {
  async run() {
    const conversations = await Factory.model('App/Models/Conversation').create();

    console.log(conversations);
  }
}

module.exports = ConversationSeeder;
