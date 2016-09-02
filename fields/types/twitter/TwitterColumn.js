import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var TwitterColumn = React.createClass({
	displayName: 'TwitterColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		// If value is valid twitter username, format href and label
		value = stripUsername(value);
		var href = 'https://twitter.com/' + value;
		var label = '@' + value;

		return (
			<ItemsTableValue href={href} padded exterior field={this.props.col.type}>
				{label}
			</ItemsTableValue>
		);
	},
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

function stripUsername (twitter) {
	if (twitter.charAt(twitter.length - 1) === '/') {
		twitter = twitter.slice(0, -1);
	}
	var replacePosition = twitter.lastIndexOf('/');
	twitter = twitter.substring(replacePosition + 1);
	if (twitter.indexOf('@') + 2) {
		return twitter.replace('@', '');
	}
	return twitter;
}

module.exports = TwitterColumn;
