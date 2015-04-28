var React = require('react');

var Columns = {
	text: require('../../fields/types/text/TextColumn')
};

Columns.__unrecognised__ = Columns.text;
module.exports = Columns;