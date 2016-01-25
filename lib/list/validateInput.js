var async = require('async');

function getValidationError(path, msg, type) {
  return {
    name: 'ValidatorError',
    path: path,
    message: msg,
    type: type || 'required'
  };
};

function validateInput (item, options, callback) {
  var data = options.data || {};

  var validationErrors = {};
  async.forEach(this.fields, function(field, callback) {
    // Validate the input for each field
    field.validateInput(data, field.required, item,
      function(err, isValid) {
        if (!isValid) {
          // Create object of validation errors
          var errorMessage = 'Error: invalid input for ' + field.label;
          var errorObject = getValidationError(field.path, errorMessage);
          validationErrors[field.path] = errorObject;
        }
        callback();
    });
  }, function (err) {
    if (err) {
      // Something threw an error
      callback(err, null);
    } else {
      // If the input is valid, validationErrors will be a 
      //  blank object {}
      callback(null, validationErrors);
    }
  });
}

module.exports = validateInput;
