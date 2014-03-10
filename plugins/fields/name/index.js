/*!
 * Module dependencies.
 */

var _ = require('underscore'),
  utils = require('keystone-utils');

module.exports = function(FieldBase, keystone) {
  return FieldBase.extend({
    /**
     * Name FieldType Constructor
     * @extends Field
     * @api public
     */
    constructor: function(list, path, options) {
      options.nofilter = true;

      FieldBase.apply(this, arguments);
    },

    /**
     * Registers the field on the List's Mongoose Schema.
     *
     * Adds String properties for .first and .last name, and a virtual
     * with get() and set() methods for .full
     *
     * @api public
     */
    addToSchema: function() {
      var schema = this.list.schema;

      var paths = this.paths = {
        first: this._path.append('.first'),
        last: this._path.append('.last'),
        full: this._path.append('.full')
      };

      schema.nested[this.path] = true;
      schema.add({
        first: String,
        last: String
      }, this.path + '.');

      schema.virtual(paths.full).get(function() {
        return _.compact([this.get(paths.first), this.get(paths.last)]).join(' ');
      });

      schema.virtual(paths.full).set(function(value) {

        if (typeof value != 'string') {
          this.set(paths.first, undefined);
          this.set(paths.last, undefined);
          return;
        }

        var split = value.split(' ');
        this.set(paths.first, split.shift());
        this.set(paths.last, split.join(' ') || undefined);

      });

      this.bindUnderscoreMethods();
    },

    /**
     * Formats the field value
     *
     * @api public
     */
    format: function(item) {
      return item.get(this.paths.full);
    },

    /**
     * Validates that a value for this field has been provided in a data object
     *
     * @api public
     */
    validateInput: function(data, required, item) {
      if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;

      return (!required || (data[this.paths.full] || data[this.paths.first] || data[this.paths.last])) ? true : false;
    },

    /**
     * Detects whether the field has been modified
     *
     * @api public
     */
    isModified: function(item) {
      return item.isModified(this.paths.first) || item.isModified(this.paths.last);
    },

    /**
     * Updates the value for this field in the item from a data object
     *
     * @api public
     */
    updateItem: function(item, data) {
      var paths = this.paths;

      var setValue = function(key) {
        if (paths[key] in data && data[paths[key]] != item.get(paths[key])) {
          item.set(paths[key], data[paths[key]]);
        }
      };

      _.each(['full', 'first', 'last'], setValue);
    }
  });
};