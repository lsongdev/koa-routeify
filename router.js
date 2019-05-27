'use strict';
const { find } = require('routing2');
const debug  = require('debug')('koa-routeify');

module.exports = (app) => {
  return async (ctx, next) => {
    const route = find(app.routes, ctx.req);
    if(!route) return next(); // not found.

    debug(route);

    var Controller = app.controllers[ route.controller ];
    if(!Controller) throw new Error(`[Router] missing controller "${route.controller}"`);

    var controller = new Controller(app);
    var action = controller[ route.action ];
    if(!action){
      throw new Error(`[Router] can not found action "${route.action}" in "${Controller.name}"`);
    }
    controller.params = route.params;
    controller.ctx    = ctx;
    controller.query  = ctx.query;
    controller.body   = ctx.request.body;
    try{
      await action.apply(controller, args);
    }catch(err){
      err.controller = controller;
      throw err;
    }
    return next();
  };
}
