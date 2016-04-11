import React from 'react';
import classnames from 'classnames';

var ListControl = React.createClass({
	propTypes: {
		dragSource: React.PropTypes.func,
		onClick: React.PropTypes.func,
		type: React.PropTypes.oneOf(['check', 'delete', 'sortable']).isRequired,
	},
	renderControl () {
		var icon = 'octicon octicon-';
		var className = classnames('ItemList__control ItemList__control--' + this.props.type, {
			'is-active': this.props.active,
		});
		var tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'check') {
			icon += 'check';
		}
		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		var renderButton = (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex}>
				<span className={icon} />
			</button>
		);
		if (this.props.dragSource) {
			return this.props.dragSource(renderButton);
		} else {
			return renderButton;
		}
	},
	render () {
		var className = 'ItemList__col--control ItemList__col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	},
});

module.exports = ListControl;
