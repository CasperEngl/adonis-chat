

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

Route.group(() => {
  Route.get('/', 'UserController.index');
}).prefix('api/v1/user');

Route.group(() => {
  
}).prefix('api/v1/message');

Route.group(() => {
  Route.any('login', 'AuthController.login');

  Route.post('register', 'AuthController.register');

  Route.post('logout', 'AuthController.logout').middleware(['auth']);

  Route.get('verify', 'AuthController.verify').middleware(['auth']);

  Route.post('token', 'AuthController.refreshToken');
}).prefix('api/v1/account');

Route.any('*', ({ view }) => view.render('index'));
