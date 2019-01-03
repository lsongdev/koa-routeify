const fs     = require('fs');
const path   = require('path');
const parser = require('routing2');
const router = require('./router');

const debug  = require('debug')('koa-routeify');

module.exports = function(app, options){
  options = Object.assign({
    routes      : './routes/',
    controllers : './controllers/'
  }, options || {});

  app.routes = [].concat.apply([],
    fs.readdirSync(path.resolve(options.routes))
    .filter(function(file){
      return /\.js$/.test(file);
    }).map(function(file){
      file = path.join(options.routes, file);
      return parser.parse(fs.readFileSync(file, 'utf8'));
    })
  );

  debug(app.routes);

  app.controllers = {};
  app.routes.map(function(route){
    app.controllers[ route.controller ] = require(
      path.join(path.resolve(options.controllers), route.controller)
    );
  });

  debug(app.controllers);

  return router(app);
};
