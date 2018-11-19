/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

const cluster = require('cluster');
const clusterPubSub = require('@adonisjs/websocket/clusterPubSub');
const os = require('os');

const numCPUs = os.cpus().length / 2;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) { // eslint-disable-line
    cluster.fork();
  }

  clusterPubSub();
  return;
}

const { Ignitor } = require('@adonisjs/ignitor');
const fold = require('@adonisjs/fold');

new Ignitor(fold)
  .appRoot(__dirname)
  .wsServer()
  .fireHttpServer()
  .catch(console.error);
