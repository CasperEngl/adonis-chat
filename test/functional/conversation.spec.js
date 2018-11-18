const prettyjson = use('prettyjson');

const { test, trait } = use('Test/Suite')('Conversation');

const User = use('App/Models/User');
const Conversation = use('App/Models/Conversation');

trait('Test/ApiClient');

test('STORE: create conversation with X users from array', async () => {
  const tests = [
    {
      first_name: 'Test',
      last_name: 'Test',
      email: 'test@gmail.com',
      password: '1234567890',
      verification_token: '',
      is_verified: true,
    },
    {
      first_name: 'Test2',
      last_name: 'Test2',
      email: 'test2@gmail.com',
      password: '1234567890',
      verification_token: '',
      is_verified: true,
    },
  ];
  const users = await Promise.all(
    tests.map(user => User.findOrCreate(
      {
        email: user.email,
      },
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        verification_token: user.verification_token,
        is_verified: user.is_verified,
      },
    )),
  );
  const conversation = await Conversation.findOrCreate(
    {
      id: 10,
    },
    {
      id: 10,
    },
  );

  const usersConversations = await Promise.all(users.map(async (user) => {
    const conversations = await user.conversations().fetch();
    const conversationsJSON = await conversations.toJSON();

    const one = conversationsJSON.some(one => one.id, conversation.id);

    if (!one) {
      await user.conversations().attach([conversation.id]);
    }

    // console.log('STORE: Single user \n', prettyjson.render(await user.toJSON()));
    console.log('STORE: Single user conversations \n', prettyjson.render(conversationsJSON));
    return conversationsJSON;
  }));

  console.log('STORE: usersCONVERSATIONS \n', prettyjson.render(usersConversations.flat()));
});

test('UPDATE: send message to conversation', async () => {
  const conversationId = 1;
  const userId = 1;
  const conversation = await Conversation.findOrCreate(
    {
      id: conversationId,
    },
    {},
  );

  const content = 'This is a test message';

  await conversation.messages().create({
    conversation_id: conversationId,
    user_id: userId,
    content,
  });

  const messages = await conversation.messages().last();
  const messagesJSON = await messages.toJSON();

  console.log(prettyjson.render(messagesJSON));
});

// test('SHOW: show specific conversation', async () => {
//   const conversationId = 1;
//   const user = await User.findOrCreate(
//     {
//       email: 'test@gmail.com',
//     },
//     {
//       first_name: 'Test',
//       last_name: 'Test',
//       email: 'test@gmail.com',
//       password: '1234567890',
//       verification_token: '',
//       is_verified: true,
//     },
//   );
//   const conversation = await Conversation.findOrCreate(conversationId);
//   const users = await conversation.users().last();
//   const usersJSON = await users.toJSON();

//   console.log(prettyjson.render(usersJSON));
// });


test('INDEX: get list of conversations', async () => {
  const conversations = await Conversation
    .query()
    .limit(3)
    .fetch();
  const conversationsJSON = await conversations.toJSON();

  conversationsJSON.map(async (conversation) => {
    const finder = await Conversation.find(conversation.id);
    const message = await finder.messages().last();

    console.log(prettyjson.render({
      conversation,
      message: message ? await message.toJSON() : null,
    }));
  });
});
