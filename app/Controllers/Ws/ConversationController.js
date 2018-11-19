class ConversationController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  onMessage(message) {
    this.socket.broadcastToAll('message', message);
  }
}

module.exports = ConversationController;
