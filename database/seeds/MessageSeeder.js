

/*
|--------------------------------------------------------------------------
| MessageSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class MessageSeeder {
  async run() {
    const messages = await Factory.model('App/Models/Message').create();

    console.log(messages);
  }
}

module.exports = MessageSeeder;
