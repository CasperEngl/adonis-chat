const Ws = use('Ws');

const Conversation = use('App/Models/Conversation');

class ChatController {
  constructor({ socket, request, auth }) {
    this.socket = socket;
    this.request = request;
    this.auth = auth;

    this.topic = socket.topic;
  }

  async onOpen() {
    try {
      const user = await this.auth.getUser();
      const id = this.topic.split('chat:');

      const conversation = await Conversation.find(id.pop());
      let messages = await conversation.messages().fetch();
      const messagesJSON = await messages.toJSON();
      let users = await conversation.users().fetch();
      const usersJSON = await users.toJSON();

      const userInConversation = usersJSON.find(u => u.id === user.id);

      if (!userInConversation) {
        this.socket.emit('disconnected');
        return;
      }

      messages = messagesJSON.map(message => ({
        id: message.id,
        conversationId: message.conversation_id,
        userId: message.user_id,
        content: message.content,
        seen: message.seen,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
      }));

      users = usersJSON.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      }));

      const data = {
        id: conversation.id,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
        messages,
        users,
      };

      console.log('user opened chat');

      Ws
        .getChannel('chat:*')
        .topic(this.topic)
        .broadcast('ready', data);
    } catch (err) {
      console.error(err);
    }
  }

  onClose() {
    // same as: socket.on('close')
  }

  onError() {
    // same as: socket.on('error')
  }

  async onMessage({ content }) {
    try {
      const user = await this.auth.getUser();
      const id = this.topic.split('chat:').pop();

      const conversation = await Conversation.find(id);
      const users = await conversation.users().fetch();
      const usersJSON = await users.toJSON();

      const userInConversation = usersJSON.find(u => u.id === user.id);

      if (!userInConversation) {
        this.socket.emit('disconnected');
        return;
      }

      const message = await conversation.messages().create({
        conversation_id: id,
        user_id: user.id,
        content,
      });

      const data = {
        id: message.id,
        conversationId: message.conversation_id,
        userId: message.user_id,
        content: message.content,
        seen: message.seen,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
      };

      console.log('sending message', data);

      Ws
        .getChannel('chat:*')
        .topic(this.topic)
        .broadcast('message', data);
      // this.socket.broadcastToAll('message', message);
    } catch (err) {
      console.error(err);
    }
  }

  async onTyping() {
    try {
      const user = await this.auth.getUser();

      console.log(`${user.id} is typing in ${this.topic}`);

      Ws
        .getChannel('chat:*')
        .topic(this.topic)
        .broadcast('typing', {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ChatController;
