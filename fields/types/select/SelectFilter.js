import classnames from 'classnames';
import React from 'react';
import { Checkbox, FormField, SegmentedControl } from 'elemental';

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
			indeterminate: false,
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

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	renderToggle () {
		return (
			<FormField>
				<SegmentedControl equalWidthSegments type="primary" options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},

	renderCheckboxes () {
		let checkboxes = this.props.field.ops.map((opt) => {
			
			let optionKey = opt.value;
			let optionValue = this.state.selectedOptions[optionKey];
			
			let itemClassname = classnames('popout__list__item', {
				'is-selected': optionValue
			});
			let iconClassname = classnames('popout__list__item__icon octicon',
				optionValue ? 'octicon-check' : 'octicon-dash'
			);
			
			return (
				<button type="button" key={'item-' + opt.value} onClick={this.toggleOption.bind(this, optionKey, !optionValue)} title={opt.label} className={itemClassname}>
					<span className={iconClassname} />
					{opt.label}
				</button>
			);
		});

		return checkboxes;
	},

	render () {
		return (
			<div>
				{this.renderToggle()}
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<Checkbox focusOnMount onChange={this.toggleAllOptions} label="Select all options" value={true} checked={this.state.allSelected} indeterminate={this.state.indeterminate} />
				</FormField>
				{this.renderCheckboxes()}
			</div>
		);
	}

});

module.exports = SelectFilter;
