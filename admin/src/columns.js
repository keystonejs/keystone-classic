var React = require('react');

var Columns = {
	text: require('../../fields/types/text/TextColumn'),
	boolean: require('../../fields/types/boolean/BooleanColumn'),
	number: require('../../fields/types/number/NumberColumn'),
	password: require('../../fields/types/password/PasswordColumn'),
};

Columns.__unrecognised__ = Columns.text;
module.exports = Columns;