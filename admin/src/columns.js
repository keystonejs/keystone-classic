var React = require('react');

var Columns = {
	text: require('../../fields/types/text/TextColumn')
	boolean: require('../../fields/types/boolean/BooleanColumn')
};

Columns.__unrecognised__ = Columns.text;
module.exports = Columns;