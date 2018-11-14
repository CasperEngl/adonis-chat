class ConversationController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }
}

module.exports = ConversationController;
