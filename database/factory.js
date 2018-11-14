/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', (faker) => {
  const user = {
    email: faker.email({
      domain: 'gmail.com',
    }),
    first_name: faker.first(),
    last_name: faker.last(),
    password: faker.string({
      length: 20,
    }),
    verification_token: faker.string({
      length: 40,
    }),
  };

  console.log(user);

  return user;
});

Factory.blueprint('App/Models/Conversation', () => ({

}));

Factory.blueprint('App/Models/Message', faker => ({
  conversation_id: 1,
  user_id: 1,
  content: faker.sentence(),
  new: faker.bool({ likelihood: 70 }),
}));
