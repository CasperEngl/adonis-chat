const User = use('App/Models/User');

// Route.get('message', 'UserController.index').as('message.index')
// Route.post('message', 'UserController.store').as('message.store')
// Route.get('message/create', 'UserController.create').as('message.create')
// Route.get('message/:id', 'UserController.show').as('message.show')
// Route.put('message/:id', 'UserController.update').as('message.update')
// Route.patch('message/:id', 'UserController.update')
// Route.get('message/:id/edit', 'UserController.edit').as('message.edit')
// Route.delete('message/:id', 'UserController.destroy').as('message.destroy')

class MessageController {
  async index() {
    const user = await User.find(1);
    const messages = await user.messages().fetch();

    return {
      messages,
    };
  }
}

module.exports = MessageController;
