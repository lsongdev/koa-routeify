var fs     = require('fs');
var path   = require('path');
var parser = require('./parser');
var router = require('./router');

module.exports = function(app, options){
  options = options || {};
  options.root = path.resolve('.');
  options = Object.assign(options || {}, {
    routes      : path.join(options.root, './server/routes/'),
    controllers : path.join(options.root, './server/controllers/')
  });

  app.routes = [].concat.apply([], fs.readdirSync(options.routes)
  .filter(function(file){
    return /\.js/.test(file);
  }).map(function(file){
    return parser(options.routes + file);
  }));

  app.controllers = {};
  app.routes.map(function(route){
    app.controllers[ route.controller ] = require(
      options.controllers + route.controller + '.js'
    );
  });

  return router(app);
};
