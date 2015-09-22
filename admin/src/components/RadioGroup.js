import React from 'react';
import blacklist from 'blacklist';
import Radio from './Radio';

var RadioGroup = React.createClass({
	displayName: 'RadioGroup',
	propTypes: {
		display: React.PropTypes.oneOf([
			'block',
			'inline'
		]),
		onChange: React.PropTypes.func,
		options: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				label: React.PropTypes.string,
				value: React.PropTypes.oneOfType([
					React.PropTypes.number,
					React.PropTypes.string,
				]),
			}),
		),
		value: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string,
		]),
	},
	getDefaultProps () {
		return {
			display: 'block',
		};
	},
	renderRadios () {
		let { options, value } = this.props;

		return options.map(opt => <Radio onChange={this.props.onChange} value={opt.value} checked={opt.value === value} style={{ display: this.props.display }} />);
	},
	render () {
		var props = blacklist(this.props, 'display', 'onChange', 'options', 'value' );
		return this.renderRadios();
	}
});

module.exports = RadioGroup;
