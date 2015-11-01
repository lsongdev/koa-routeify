var fs     = require('fs');
var path   = require('path');
var parser = require('./parser');
var router = require('./router');

var debug  = require('debug')('koa-routeify');

module.exports = function(app, options){
  options = Object.assign({
    routes      : './routes/',
    controllers : './controllers/'
  }, options || {});

  app.routes = [].concat.apply([], fs.readdirSync(path.resolve(options.routes))
  .filter(function(file){
    return /\.js$/.test(file);
  }).map(function(file){
    return parser(path.join(options.routes, file));
  }));

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
