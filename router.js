'use strict';
const debug  = require('debug')('koa-routeify');

function matches(ctx, method) {
  if (!method)
    return true;
  if (ctx.method === method)
    return true;
  if (method === 'GET' && ctx.method === 'HEAD')
    return true;
  return false;
};

exports.matches = matches;

module.exports = function router(app){
  return function*(next){
    var ctx = this;
    var params = {};
    var match;
    var route = app.routes.find(function(route){
      if(!matches(ctx, route.method)) return false;
      match = ctx.path.match(route.regexp);
      if(match) return true;
    });

    if(route == null) return yield* next; // not found.

    debug(route);
    
    var args = match.slice(1).map(function(arg) {
      // avoid decode the `undefined`.
      return arg === undefined ? arg : decodeURIComponent(arg);
    });
    route.keys.forEach(function(key, i){
      params[ key.name ] = args[ i ];
    });
    var Controller = app.controllers[ route.controller ];
    if(!Controller) throw new Error(`[Router] missing controller "${route.controller}"`);

    var controller = new Controller(app);
    var action = controller[ route.action ];
    if(!action){
      throw new Error(`[Router] can not found action "${route.action}" in "${Controller.name}"`);
    }
    controller.params = params;
    controller.ctx    = this;
    controller.query  = this.query;
    controller.body   = this.request.body;
    try{
      yield action.apply(controller, args);
    }catch(err){
      err.controller = controller;
      throw err;
    }
    yield next;
  };
}
