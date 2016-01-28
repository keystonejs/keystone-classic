var async = require('async');

/**
 * Validates the input for all fields in an item
 * @param  {List Item}   item       an instance of a List object
 * @param  {Object}      data       the data object to validate
 * @param  {Function}    callback   invoked with no params when valid data
 *                                    or an object of validation errors
 */
function validateInput (item, data, callback) {
  var validationErrors = {};
  async.forEach(this.fields, function(field, callback) {
    // Validate the input for each field
    field.validateInput(data, field.required, item,
      function(error) {
        if (error) {
          validationErrors[field.path] = error;
        }
        callback();
    });
  }, function () {
    if (Object.keys(validationErrors).length > 0) {
      // There were validation errors
      callback(validationErrors);
    } else {
      // If the input is valid, validationErrors will be a 
      //  blank object {}
      callback();
    }
  });
}

module.exports = validateInput;
