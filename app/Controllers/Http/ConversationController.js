const Message = use('App/Models/Message');
const Conversation = use('App/Models/Conversation');

// Route.get('conversation', 'ConversationController.index').as('conversation.index')
// Route.post('conversation', 'ConversationController.store').as('conversation.store')
// Route.get('conversation/:id', 'ConversationController.show').as('conversation.show')
// Route.put('conversation/:id', 'ConversationController.update').as('conversation.update')
// Route.patch('conversation/:id', 'ConversationController.update')
// Route.delete('conversation/:id', 'ConversationController.destroy').as('conversation.destroy')

class ConversationController {
  async index({ auth, response }) {
    try {
      const user = await auth.getUser();

      let conversations = await user.conversations().fetch();
      const conversationsJSON = await conversations.toJSON();

      console.log(new Date());

      conversations = await Promise.all(conversationsJSON.map(async (conversation) => {
        const finder = await Conversation.find(conversation.id);
        const message = await finder.messages().last();

        return {
          id: conversation.id,
          createdAt: conversation.created_at,
          updatedAt: conversation.updated_at,
          message: message ? await message.toJSON() : null,
        };
      }));

      return {
        conversations,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async store({ response, auth }) { // LAV NY SAMTALE
    try {
      const user = await auth.getUser();
      const conversation = await Conversation.create();

      await user.conversations().attach(conversation);

      response.status(200);

      return {
        message: `Conversation ${conversation.id} created`,
      };
    } catch (err) {
      console.error(err);

      response.status(401);
    }
  }

  async update({
    auth, params, request, response,
  }) { // SEND BESKED TIL SAMTALE (opdater med ny besked)
    try {
      const { id } = params;
      const user = await auth.getUser();
      const conversation = await Conversation.find(id);

      const { content } = request.only(['content']);

      await conversation.messages().create({
        conversation_id: id,
        user_id: user.id,
        content,
      });

      const messages = await conversation.messages().fetch();

      response.status(200);

      return {
        conversation,
        messages,
      };
    } catch (err) {
      console.error(err);

      response.status(401);
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
