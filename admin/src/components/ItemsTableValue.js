import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';

var ItemsTableValue = React.createClass({
	displayName: 'ItemsTableValue',
	propTypes: {
		className: React.PropTypes.string,
		exterior: React.PropTypes.bool,
		field: React.PropTypes.string,
		interior: React.PropTypes.bool,
		padded: React.PropTypes.bool,
	},
	render: function() {
		let tag = this.props.href ? 'a' : 'span';
		let className = classnames('ItemList__value', (
			this.props.field ? ('ItemList__value--' + this.props.field) : null
		), {
			'ItemList__link--exterior': this.props.href && this.props.exterior,
			'ItemList__link--interior': this.props.href && this.props.interior,
			'ItemList__link--padded':   this.props.href && this.props.padded,
		}, this.props.className);

		var props = blacklist(this.props, 'className', 'exterior', 'field', 'interior', 'padded');
		props.className = className;

		return React.createElement(
			tag,
			props,
			this.props.children
		);
	}
});

module.exports = ItemsTableValue;
