var updateItem = require('./updateItem');

// Function interface to the updateItem method for subforms
function updateSubItem (fieldsArray, item, data, files, callback) {
	var fakeItem = { fieldsArray: fieldsArray };
	var options = { files: files };
	updateItem.call(fakeItem, item, data, options, callback, true);
}

module.exports = updateSubItem;
