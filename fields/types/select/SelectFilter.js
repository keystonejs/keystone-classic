import React from 'react';
import { Checkbox, FormField, SegmentedControl } from 'elemental';
import PopoutList from '../../../admin/client/components/PopoutList';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

function getDefaultValue () {
	return {
		inverted: TOGGLE_OPTIONS[0].value,
		value: [],
	};
}

var SelectFilter = React.createClass({
	propTypes: {
		field: React.PropTypes.object,
		filter: React.PropTypes.shape({
			inverted: React.PropTypes.boolean,
			value: React.PropTypes.array,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	toggleInverted (inverted) {
		this.updateFilter({ inverted });
	},
	toggleAllOptions () {
		const { field, filter } = this.props;
		if (filter.value.length < field.ops.length) {
			this.updateFilter({ value: field.ops.map(i => i.value) });
		} else {
			this.updateFilter({ value: [] });
		}
	},
	selectOption (option) {
		let value = this.props.filter.value.concat(option.value);
		this.updateFilter({ value });
	},
	removeOption (option) {
		let value = this.props.filter.value.filter(i => i !== option.value);
		this.updateFilter({ value });
	},
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	renderOptions () {
		return this.props.field.ops.map((option, i) => {
			let selected = this.props.filter.value.indexOf(option.value) > -1;
			return (
				<PopoutList.Item
					key={`item-${i}-${option.value}`}
					icon={selected ? 'check' : 'dash'}
					isSelected={selected}
					label={option.label}
					onClick={() => {
						if (selected) this.removeOption(option);
						else this.selectOption(option);
					}}
				/>
			);
		});
	},
	render () {
		const { field, filter } = this.props;
		const allSelected = filter.value.length;
		const indeterminate = filter.value.lenght === field.ops.length;
		return (
			<div>
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<Checkbox autofocus onChange={this.toggleAllOptions} label="Select all options" checked={allSelected} indeterminate={indeterminate} />
				</FormField>
				{this.renderOptions()}
			</div>
		);
	},
});

module.exports = SelectFilter;
