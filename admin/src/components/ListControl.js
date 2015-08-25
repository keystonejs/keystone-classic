var React = require('react');

var ListControl = React.createClass({

	propTypes: {
		onClick: React.PropTypes.func,
		type: React.PropTypes.oneOf(['delete', 'sortable'])
	},

	renderControl () {
		var icon = 'octicon octicon-';
		var className = 'ItemList__control ItemList__control--' + this.props.type;
		var tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		return (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex}>
				<span className={icon} />
			</button>
		);
	},

	render () {
		var className = 'ItemList__control-col ItemList__control-col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	}

});

module.exports = ListControl;
