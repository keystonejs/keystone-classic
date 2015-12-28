import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: TOGGLE_OPTIONS[0].value,
		value: '',
	};
}

var TextFilter = React.createClass({

	statics: {
		getDefaultValue: getDefaultValue,
	},

	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: React.PropTypes.boolean,
			value: React.PropTypes.string,
		})
	},

	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},

	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},

	selectMode (mode) {
		this.updateFilter({ mode });
		ReactDOM.findDOMNode(this.refs.focusTarget).focus();
	},

	toggleInverted (inverted) {
		this.updateFilter({ inverted });
		ReactDOM.findDOMNode(this.refs.focusTarget).focus();
	},

	updateValue (e) {
		this.updateFilter({ value: e.target.value });
	},

	render () {
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter((i => i.value === filter.mode))[0];
		const placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

		return (
			<div>
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={mode.value} />
				<FormField>
					<FormInput autofocus ref="focusTarget" value={this.props.filter.value} onChange={this.updateValue} placeholder={placeholder} />
				</FormField>
			</div>
		);
	}

});

module.exports = TextFilter;
