
var debug = require('debug')('keystone:admin:app');//eslint-disable-line no-unused-vars
var babelify = require('babelify');
var browserify = require('browserify-middleware');
var express = require('express');
var packages = require('./packages');
var _ = require('underscore');

var admin = function(keystone) {
  debug('Initializing admin');

  var app = express();

  // ensure admin nav has been initialised
  if (!keystone.nav) {
    debug('Setting up navigation');
    keystone.nav = keystone.initNav();
  }

  // configure middleware
  app.use('/styles', require('less-middleware')(__dirname + '/public/styles'));
  app.use(express.static(__dirname + '/public'));
  app.use('/js', browserify(__dirname + '/src/views', {
    external: packages,
    transform: [babelify.configure({
      ignore: ['**/bootstrap-markdown.js'],
      plugins: [require('babel-plugin-object-assign')]
    })]
  }));

  if (keystone.get('auth') === true) {
    debug('Setting up authentication');

    if (!keystone.get('signout url')) {
      keystone.set('signout url', '/' + keystone.get('admin uri') + '/signout');
    }
    if (!keystone.get('signin url')) {
      keystone.set('signin url', '/' + keystone.get('admin uri') + '/signin');
    }

    if (!keystone.nativeApp || !keystone.get('session')) {
      app.all('/*', keystone.session.persist);
    }

    app.all('/signin', require('./routes/views/signin'));
    app.all('/signout', require('./routes/views/signout'));
    app.all('/*', keystone.session.keystoneAuth);

  } else if ('function' === typeof keystone.get('auth')) {
    debug('Setting up authentication');
    app.all('/*', keystone.get('auth'));
  }

  // Email test routes
  if (keystone.get('email tests')) {
    debug('Setting email test routes');
    keystone.bindEmailTestRoutes(app, keystone.get('email tests'));
  }

  // Cloudinary API for selecting an existing image / upload a new image
  if (keystone.get('cloudinary config')) {
    debug('setting cloudinary api');
    app.get('/api/cloudinary/get', require('./api/cloudinary').get);
    app.get('/api/cloudinary/autocomplete', require('./api/cloudinary').autocomplete);
    app.post('/api/cloudinary/upload', require('./api/cloudinary').upload);
  }

  function initList(respectHiddenOption) {
    return function(req, res, next) {
      req.list = keystone.list(req.params.list);

      if (!req.list || (respectHiddenOption && req.list.get('hidden'))) {
        debug('could not find list ', req.params.list);
        req.flash('error', 'List ' + req.params.list + ' could not be found.');
        return res.redirect('/' + keystone.get('admin uri'));
      }

      debug('getting list ', req.params.list);
      next();
    };
  }

  debug('Setting admin route');
  app.all('/', require('./routes/views/home'));
  // Generic Lists API
  debug('Setting generic API');
  app.all('/api/:list/:action(autocomplete|get|order|create|delete|fetch)', initList(), require('./api/list'));
  app.get('/api/:list/:id', initList(), require('./api/item/get'));

  debug('Setting generic Lists download route');
  app.all('/download/:list', initList(), require('./api/download'));
  // Admin-UI API
  debug('Setting list and item details admin routes');
  app.all('/:list/:page([0-9]{1,5})?', initList(true), require('./routes/views/list'));
  app.all('/:list/:item', initList(true), require('./routes/views/item'));

  return app;
};

module.exports = admin;
