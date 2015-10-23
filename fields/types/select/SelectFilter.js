import React from 'react';
import { Checkbox, FormField, SegmentedControl } from 'elemental';
import PopoutList from '../../../admin/client/components/PopoutList';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

var SelectFilter = React.createClass({

	getInitialState () {
		return {
			inverted: TOGGLE_OPTIONS[0].value,
			selectedOptions: {},
			allSelected: false,
			indeterminate: false
		};
	},

	toggleAllOptions () {
		this.props.field.ops.map(opt => this.toggleOption(opt.value, !this.state.allSelected));
	},

	toggleOption (option, value) {
		let newOptions = this.state.selectedOptions;

		if (value) {
			newOptions[option] = value;
		} else {
			delete newOptions[option];
		}

		let optionCount = Object.keys(newOptions).length;

		this.setState({
			selectedOptions: newOptions,
			indeterminate: !!optionCount && optionCount !== this.props.field.ops.length,
			allSelected: optionCount === this.props.field.ops.length
		});
	},

	renderToggle () {
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={() => this.setState({ inverted: !this.state.inverted })} />
			</FormField>
		);
	},

	renderOptions () {
		let options = this.props.field.ops.map((opt) => {

			let optionKey = opt.value;
			let optionValue = this.state.selectedOptions[optionKey];

			return (
				<PopoutList.Item
					key={'item_' + opt.value}
					icon={optionValue ? 'check' : 'dash'}
					isSelected={optionValue}
					label={opt.label}
					onClick={this.toggleOption.bind(this, optionKey, !optionValue)} />
			);
		});

		return options;
	},

	render () {
		return (
			<div>
				{this.renderToggle()}
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<Checkbox focusOnMount onChange={this.toggleAllOptions} label="Select all options" value={true} checked={this.state.allSelected} indeterminate={this.state.indeterminate} />
				</FormField>
				{this.renderOptions()}
			</div>
		);
	}

});

module.exports = SelectFilter;
