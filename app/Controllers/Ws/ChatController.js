class ChatController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;

    console.log(socket.topic);
  }

  onClose() {
    // same as: socket.on('close')
  }

  onError() {
    // same as: socket.on('error')
  }

  onMessage(message) {
    console.log(message);
    this.socket.broadcastToAll('message', message);
  }
}

module.exports = ChatController;
