/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.resource('api/v1/user', 'UserController');

Route.resource('api/v1/conversation', 'ConversationController');

Route.resource('api/v1/message', 'MessageController');

Route.group(() => {
  Route.post('login', 'LoginController.index').validator('Login');

  Route.post('logout', 'LogoutController.index').middleware(['auth']);

  Route.post('register', 'RegisterController.index');

  Route.post('token', 'TokenController.refresh');

  Route.get('token/verify-email/:token', 'TokenController.verifyEmail');
}).prefix('api/v1/account');

Route.get('/error/:errorCode', 'ErrorController.index').as('error');

Route.any('*', ({ view }) => view.render('index')).as('home');
