var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    junk = require('junk'),
    utils = require('keystone-utils'),
    FieldBase = require('./field'),
    keystone = require('../');

var joinPath = function() {
  return '.' + path.sep + path.join.apply(path, arguments);
};

var importer = function(rel__dirname) {
  return function(from) {
    var imported = {},
        fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);

    if (fs.existsSync(fsPath)) fs.readdirSync(fsPath).filter(junk.not).forEach(function(name) {
      var fieldFactory = require(path.join(rel__dirname, from, name));
      var field = fieldFactory(FieldBase, keystone);
      field.templatePath = path.join(fsPath, name, 'templates');
      imported[utils.upcase(name)] = field;
      return imported;
    });

    return imported;
  };
};

var bundledImporter = importer(path.resolve(__dirname, '../'));
var pluginImporter = importer(path.join(process.cwd(), 'keystone'));

module.exports = _.extend({}, bundledImporter('./fields'), pluginImporter('./fields'));