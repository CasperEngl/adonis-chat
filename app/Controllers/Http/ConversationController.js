const Message = use('App/Models/Message');
const Conversation = use('App/Models/Conversation');

// Route.get('conversation', 'UserController.index').as('conversation.index')
// Route.post('conversation', 'UserController.store').as('conversation.store')
// Route.get('conversation/create', 'UserController.create').as('conversation.create')
// Route.get('conversation/:id', 'UserController.show').as('conversation.show')
// Route.put('conversation/:id', 'UserController.update').as('conversation.update')
// Route.patch('conversation/:id', 'UserController.update')
// Route.get('conversation/:id/edit', 'UserController.edit').as('conversation.edit')
// Route.delete('conversation/:id', 'UserController.destroy').as('conversation.destroy')

class ConversationController {
  async index() {
    try {
      const conversations = await Conversation.all();

      const formatted = await Promise.all(conversations.toJSON().map(async (conversation) => {
        const message = await Message.query()
          .where('conversation_id', conversation.id)
          .last();

        if (message) {
          return {
            conversation,
            message: message.toJSON(),
          };
        }

        return {
          conversation,
        };
      }));

      return {
        conversations: formatted,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async create({ response, auth }) {
    try {
      const user = await auth.getUser();
      const conversation = await Conversation.create();

      await user.conversations().attach([conversation.id]);

      response.status(200);

      return {

      };
    } catch (err) {
      console.error(err);
    }
  }

  async show({ params }) {
    const conversation = await Conversation.find(params.id);
    const messages = await conversation.messages().fetch();

    return {
      conversation,
      messages,
    };
  }
}

module.exports = ConversationController;
