var async = require('async');

function processFormData (item, formData, callback) {
  var data = formData.data || {};
  var files = formData.files || {};

  async.forEach(this.fieldsArray, function(field, callback) {
    field.processFormData(item, {
      data: data,
      files: files,
    }, callback);
  }, function(error) {
    // Error processing formData
    if (error) return callback(error, null);

    async.series([
      // Validata data
      function(callback) {
        this.validateInput(item, data,
          function(error) {
            callback(error);
        });
      }.bind(this),
      // Update data
      function(callback) {
        this.updateItem(item, data,
          function(error) {
            callback(error);
        });
      }.bind(this),
    ], function(error) {
      // If item was updated successfully,
      //  error will be null and the item will have
      //  been modified by reference.
      callback(error, item);
    });
  }.bind(this));
};

module.exports = processFormData;
