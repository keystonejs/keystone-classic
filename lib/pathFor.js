

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
};


NamedRoutes.prototype.map = function(routes) {
  console.log("MAP");
  routes.call(this, this.app, this.as);
};

NamedRoutes.prototype.pathFor = function(path, params, query) {
  var path = this.routes[path];
  if(!path) throw new Error('Unknown path name: ' + path);
  params = params || {};
  return path.replace(/:[a-zA-Z0-9\-_]+/g, function(param) {
    return params[param.substr(1)];
  });
};

