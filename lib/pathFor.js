var qs = require('querystring');


var NamedRoutes = exports.NamedRoutes = function() {
  var self = this;

  this.routes = {};

  /* Store the recently generated route in case it's named */
  /* This needs to be done in two steps due to Express format of route definitions */
  this.lastRoute = null;
  this.addRoute = function(route) {
    self.lastRoute = route;
  };

  /* Mock all the Express VERBs to catch the routes */
  this.app = {
    all: this.addRoute,
    get: this.addRoute,
    post: this.addRoute,
    put: this.addRoute,
    delete: this.addRoute,
  };

  /* Save the recently generated route */
  this.as = function(name) {
    self.routes[name] = self.lastRoute;
  };

  /* Bind the helper */
  this.pathFor = function() {
    return self._pathFor.apply(self, arguments);
  };
};


NamedRoutes.prototype.map = function(routes) {
  routes.call(this, this.app, this.as);
};


NamedRoutes.prototype._pathFor = function(path, params, query) {
  var route = this.routes[path];
  if(!route) throw new Error('Unknown path name: ' + path);
  
  params = params || {};
  var querystring = query ? '?' + qs.stringify(query) : ''

  return route.replace(/:[a-zA-Z0-9\-_]+/g, function(param) {
    return params[param.substr(1)];
  }) + querystring;
};

