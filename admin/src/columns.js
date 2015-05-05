var React = require('react');

var Columns = {
	text: require('../../fields/types/text/TextColumn'),
	boolean: require('../../fields/types/boolean/BooleanColumn'),
	password: require('../../fields/types/password/PasswordColumn'),
	location: require('../../fields/types/location/LocationColumn'),
	select: require('../../fields/types/select/SelectColumn'),
	money: require('../../fields/types/money/MoneyColumn'),
	url: require('../../fields/types/url/UrlColumn'),
	datetime: require('../../fields/types/datetime/DateTimeColumn'),
	code: require('../../fields/types/code/CodeColumn')
};

Columns.__unrecognised__ = Columns.text;
module.exports = Columns;