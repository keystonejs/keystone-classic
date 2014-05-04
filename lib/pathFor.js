var _ = require('underscore');
var qs = require('querystring');



var namedRoutes = {};

var unmocked = {};



var pathFor = module.exports = function(path, params) {
  var route = namedRoutes[path];
  if(!route) throw new Error('Unknown path name: ' + path);
  
  params = params || {};

  route = route.replace(/:[a-zA-Z0-9\-_]+/g, function(sParam) {
    var param = sParam.substr(1);
    if(typeof params[param] === 'undefined') throw new Error('Missing parameter: ' + param + ' for path: ' + path);
    var result = params[param];
    delete params[param];
    return result;
  });

  var querystring = _.size(params) ? '?' + qs.stringify(params) : ''

  return route + querystring;
};



pathFor.routes = namedRoutes;



var verbs = ['get', 'put', 'post', 'delete', 'all'];

var mockVerb = function(verb) {

  return function() {
    var args = Array.prototype.slice.call(arguments);                   // get arguments as a proper array
    if (args.length > 2 && 'object' == typeof args[args.length - 1]) {  // see if options are set
      var options = args[args.length - 1];
      if(options.as) namedRoutes[options.as] = args[0];                 // put the route path in the namedRoutes map
      args.pop();                                                       // remove the route name from the arguments array so express doesn't see it
    }

    verb.apply(this, args);                                             // call the original express method
  };
};



pathFor.mock = function(app) {
  for(var i in verbs) {
    var verb = verbs[i];
    unmocked[verb] = app[verb];
    app[verb] = mockVerb(app[verb]);
  }
};



pathFor.unmock = function(app) {
  for(var i in verbs) {
    var verb = verbs[i];
    app[verb] = unmocked[verb];
    delete unmocked[verb];
  }
};





