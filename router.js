
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
    var routes = app.routes.filter(function(route){
      if(!matches(ctx, route.method)) return false;
      if(route.regexp.test(ctx.path)) return true;
    });
    if(!routes.length) return yield* next;// not found.
    var route = routes[ 0 ];
    var args = route.regexp.exec(this.path).slice(1).map(decodeURIComponent);
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
    controller.ctx    = this;
    controller.body   = this.request.body;
    controller.params = params;
    yield* action.apply(controller, args);
  };
}
