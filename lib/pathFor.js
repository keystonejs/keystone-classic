var qs = require('querystring');


var NamedRoutes = exports.NamedRoutes = function() {
  var self = this;

  this.routes = {};

  this.lastRoute = null;
  this.addRoute = function(route) {
    self.lastRoute = route;
  };

  this.app = {
    all: this.addRoute,
    get: this.addRoute,
    post: this.addRoute,
    put: this.addRoute,
    delete: this.addRoute,
  };

  this.as = function(name) {
    self.routes[name] = self.lastRoute;
  };

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

