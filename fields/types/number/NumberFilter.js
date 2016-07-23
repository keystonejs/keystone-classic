import React from 'react';
import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		value: '',
	};
}

var NumberFilter = React.createClass({
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},

	componentDidMount () {
		// focus the text input
		this.refs.focusTarget.focus();
	},

	handleChangeBuilder (type) {
		const self = this;
		return function handleChange (e) {
			const { filter, onChange } = self.props;

			switch (type) {
				case 'minValue':
					onChange({
						mode: filter.mode,
						value: {
							min: e.target.value,
							max: filter.value.max,
						},
					});
					break;
				case 'maxValue':
					onChange({
						mode: filter.mode,
						value: {
							min: filter.value.min,
							max: e.target.value,
						},
					});
					break;
				case 'value':
					onChange({
						mode: filter.mode,
						value: e.target.value,
					});
			}
		};
	},
	// Update the props with this.props.onChange
	updateFilter (changedProp) {
		this.props.onChange({ ...this.props.filter, ...changedProp });
	},
	// Update the filter mode
	selectMode (mode) {
		this.updateFilter({ mode });

		// focus on next tick
		setTimeout(() => {
			this.refs.focusTarget.focus();
		}, 0);
	},

	renderControls (mode) {
		let controls;
		const { field } = this.props;
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		if (mode.value === 'between') {
			controls = (
				<FormRow>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput
							onChange={this.handleChangeBuilder('minValue')}
							placeholder="Min."
							ref="focusTarget"
							type="number"
						/>
					</FormField>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput
							onChange={this.handleChangeBuilder('maxValue')}
							placeholder="Max."
							type="number"
						/>
					</FormField>
				</FormRow>
			);
		} else {
			controls = (
				<FormField>
					<FormInput
						onChange={this.handleChangeBuilder('value')}
						placeholder={placeholder}
						ref="focusTarget"
						type="number"
					/>
				</FormField>
			);
		}

		return controls;
	},

	render () {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];

		return (
			<div>
				<FormSelect
					onChange={this.selectMode}
					options={MODE_OPTIONS}
					value={mode.value}
				/>
				{this.renderControls(mode)}
			</div>
		);
	},

});

module.exports = NumberFilter;
