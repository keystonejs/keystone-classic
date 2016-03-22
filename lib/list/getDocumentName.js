var utils = require('keystone-utils');

/**
 * Gets the name of the provided document from the correct path
 *
 * Example:
 *     var name = list.getDocumentName(item)
 *
 * @param {Object} item
 * @param {Boolean} escape - causes HTML entities to be encoded
 */
function getDocumentName (doc, escape) {
	// console.log('getting document name for ' + doc.id, 'nameField: ' + this.nameField, 'namePath: ' + this.namePath);
	// console.log('raw name value: ', doc.get(this.namePath));
	// if (this.nameField) console.log('formatted name value: ', this.nameField.format(doc));
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	return (escape) ? utils.encodeHTMLEntities(name) : name;
}

module.exports = getDocumentName;
