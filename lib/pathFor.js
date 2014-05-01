var qs = require('querystring');


var NamedRoutes = exports.NamedRoutes = function namedRoutes() {
  var self = this;

  this.routes = {};
  this.unmocked = {};

  /* Bind the helper */
  this.pathFor = function() {
    return self._pathFor.apply(self, arguments);
  };
};


NamedRoutes.prototype.mockVerb = function(verb) {
  var self = this;

  return function() {
    var args = Array.prototype.slice.call(arguments);                   // get arguments as a proper array
    if (args.length > 2 && 'object' == typeof args[args.length - 1]) {  // see if options are set
      var options = args[args.length - 1];
      if(options.as) self.routes[options.as] = args[0];                 // put the route path in the namedRoutes map
      args.pop();                                                       // remove the route name from the arguments array so express doesn't see it
    }

    verb.apply(this, args);                                             // call the original express method
  };
};

var verbs = ['get', 'put', 'post', 'delete', 'all'];


NamedRoutes.prototype.mock = function(app) {
  for(var i in verbs) {
    var verb = verbs[i];
    this.unmocked[verb] = app[verb];
    app[verb] = this.mockVerb(app[verb]);
  }
};

NamedRoutes.prototype.unmock = function(app) {
  for(var i in verbs) {
    var verb = verbs[i];
    app[verb] = this.unmocked[verb];
  }
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




