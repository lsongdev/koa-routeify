'use strict';
const debug  = require('debug')('koa-routeify');

function matches(ctx, method) {
  if (ctx.method === method)
    return true;
  if (method === 'GET' && ctx.method === 'HEAD')
    return true;
  if (!method)
    return true;
  return false;
};

exports.matches = matches;

module.exports = (app) => {
  return async (ctx, next) => {
    var params = {};
    var match;
    var route = app.routes.find(function(route){
      if(!matches(ctx, route.method)) return false;
      match = ctx.path.match(route.regexp);
      if(match) return true;
    });

    if(route == null) return await next(); // not found.

    debug(route);

    var args = match.slice(1).map(function(arg) {
      // avoid decode the `undefined`.
      return arg === undefined ? arg : decodeURIComponent(arg);
    });
    route.regexp.keys.forEach(function(key, i){
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
    controller.ctx    = ctx;
    controller.query  = ctx.query;
    controller.body   = ctx.request.body;
    try{
      await action.apply(controller, args);
    }catch(err){
      err.controller = controller;
      throw err;
    }
    await next();
  };
}
