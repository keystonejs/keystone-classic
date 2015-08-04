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
function getDocumentName(doc, escape) {
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	return (escape) ? utils.encodeHTMLEntities(name) : name;
}

module.exports = getDocumentName;
