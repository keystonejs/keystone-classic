import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import { FormField, FormInput, FormRow, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
	{ label: 'On', value: 'on' },
	{ label: 'After', value: 'after' },
	{ label: 'Before', value: 'before' },
	{ label: 'Between', value: 'between' },
];

var DayPickerIndicator = React.createClass({
	render () {
		return (
			<span className="DayPicker-Indicator">
				<span className="DayPicker-Indicator__border" />
				<span className="DayPicker-Indicator__bg" />
			</span>
		);
	},
});

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: TOGGLE_OPTIONS[0].value,
		value: moment(0, 'HH').format(),
		before: moment(0, 'HH').format(),
		after: moment(0, 'HH').format(),
	};
}

var DateFilter = React.createClass({
	displayName: 'DateFilter',
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: React.PropTypes.boolean,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			format: 'DD-MM-YYYY',
			filter: getDefaultValue(),
			value: moment().startOf('day').toDate(),
		};
	},
	getInitialState () {
		return {
			activeInputField: 'after',
			month: new Date(), // The month to display in the calendar
		};
	},
	componentDidMount () {
		// focus the text input
		if (this.props.filter.mode === 'between') {
			ReactDOM.findDOMNode(this.refs[this.state.activeInputField]).focus();
		} else {
			ReactDOM.findDOMNode(this.refs.input).focus();
		}
	},
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	toggleInverted (value) {
		this.updateFilter({ inverted: value });
		ReactDOM.findDOMNode(this.refs.input).focus();
	},
	selectMode (mode) {
		this.updateFilter({ mode });
		if (mode === 'between') {
			setTimeout(() => { ReactDOM.findDOMNode(this.refs[this.state.activeInputField]).focus(); }, 200);
		} else {
			ReactDOM.findDOMNode(this.refs.input).focus();
		}
	},
	handleInputChange (e) {
		const { value } = e.target;
		let { month } = this.state;
			// Change the current month only if the value entered by the user is a valid
		// date, according to the `L` format
		if (moment(value, 'L', true).isValid()) {
			month = moment(value, 'L').toDate();
		}
		this.updateFilter({ value: value });
		this.setState({ month }, this.showCurrentDate);
	},
	setActiveField (field) {
		this.setState({
			activeInputField: field,
		});
	},
	switchBetweenActiveInputFields (e, day, modifiers) {
		if (modifiers.indexOf('disabled') > -1) return;
		const { activeInputField } = this.state;
		let send = {};
		send[activeInputField] = day;
		this.updateFilter(send);
		const newActiveField = (activeInputField === 'before') ? 'after' : 'before';
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				ReactDOM.findDOMNode(this.refs[newActiveField]).focus();
			}
		);
	},
	selectDay (e, day, modifiers) {
		if (modifiers.indexOf('disabled') > -1) return;
		this.updateFilter({ value: day });
	},
	showCurrentDate () {
		this.refs.daypicker.showMonth(this.state.month);
	},
	renderToggle () {
		const { filter } = this.props;
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},
	renderControls () {
		let controls;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		// DayPicker stuff
		const modifiers = {
			selected: (day) => moment(filter.value).isSame(day),
		};

		if (mode.value === 'between') {
			controls = (
				<div>
					<FormRow>
						<FormField width="one-half">
							<FormInput ref="after" placeholder="From" onFocus={(e) => { this.setActiveField('after'); }} value={moment(filter.after).format(this.props.format)} />
						</FormField>
						<FormField width="one-half">
							<FormInput ref="before" placeholder="To" onFocus={(e) => { this.setActiveField('before'); }} value={moment(filter.before).format(this.props.format)} />
						</FormField>
					</FormRow>
					<div style={{ position: 'relative' }}>
						<DayPicker
							modifiers={modifiers}
							className="DayPicker--chrome"
							onDayClick={this.switchBetweenActiveInputFields}
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<FormField>
						<FormInput
							ref="input"
							placeholder={placeholder}
							value={moment(filter.value).format(this.props.format)}
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
						/>
					</FormField>
					<div style={{ position: 'relative' }}>
						<DayPicker
							ref="daypicker"
							modifiers={modifiers}
							className="DayPicker--chrome"
							onDayClick={this.selectDay}
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		}

		return controls;
	},
	render () {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		return (
			<div>
				{this.renderToggle()}
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={mode.value} />
				{this.renderControls()}
			</div>
		);
	},
});

module.exports = DateFilter;
