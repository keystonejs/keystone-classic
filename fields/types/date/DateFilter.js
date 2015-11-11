import _ from 'underscore';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';

import { FormField, FormInput, FormRow, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

const MODE_OPTIONS = [
	{ label: 'On',      value: 'on' },
	{ label: 'After',   value: 'after' },
	{ label: 'Before',  value: 'before' },
	{ label: 'Between', value: 'between' }
];

var DayPickerIndicator = React.createClass({
	render () {
		return (
			<span className="DayPicker-Indicator">
				<span className="DayPicker-Indicator__border" />
				<span className="DayPicker-Indicator__bg" />
			</span>
		);
	}
});
var DateFilter = React.createClass({
	displayName: 'DateFilter',
	getInitialState () {
		return {
			activeInputField: 'from',
			modeValue: MODE_OPTIONS[0].value, // 'on'
			modeLabel: MODE_OPTIONS[0].label, // 'On'
			month: new Date(), // The month to display in the calendar
			inverted: TOGGLE_OPTIONS[0].value,
			// value: moment().format("L"), // The value of the input field
		};
	},
	getDefaultProps () {
		return {
			format: 'DD-MM-YYYY'
		};
	},
	componentDidMount () {
		// focus the text input
		React.findDOMNode(this.refs.input).focus();
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},
	selectMode (mode) {
		// TODO: implement w/o underscore
		this.setState({
			modeValue: mode,
			modeLabel: _.findWhere(MODE_OPTIONS, { value: mode }).label
		});

		// focus the text input after a mode selection is made
		React.findDOMNode(this.refs.input).focus();
	},

	handleInputChange(e) {

		const { value } = e.target;
		let { month } = this.state;

		// Change the current month only if the value entered by the user is a valid
		// date, according to the `L` format
		if (moment(value, "L", true).isValid()) {
		  month = moment(value, "L").toDate();
		}

		this.setState({ value, month }, this.showCurrentDate);

	},
	selectDay (e, day, modifiers) {
		if (modifiers.indexOf("disabled") > -1) return;

		this.setState({
			value: day
		});
	},
	showCurrentDate() {
		this.refs.daypicker.showMonth(this.state.month);
	},

	renderToggle () {
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},
	renderControls () {
		let controls;
		let { field } = this.props;
		let { modeLabel, modeValue, value } = this.state;
		let placeholder = field.label + ' is ' + modeLabel.toLowerCase() + '...';

		// DayPicker stuff
		const modifiers = {
			'selected': (day) => moment(value).isSame(day)
		};
		const selectedDay = moment(this.state.value, "L", true).toDate();

		if (modeValue === 'between') {
			controls = (
				<div>
					<FormRow>
						<FormField width="one-half">
							<FormInput ref="from" placeholder="From" />
						</FormField>
						<FormField width="one-half">
							<FormInput ref="to" placeholder="To" />
						</FormField>
					</FormRow>
					<div style={{ position: 'relative' }}>
						<DayPicker
							modifiers={ modifiers }
							className="DayPicker--chrome"
							onDayClick={ this.handleChange }
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
							value={moment(value).format(this.props.format)}
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
						/>
					</FormField>
					<div style={{ position: 'relative' }}>
						<DayPicker
							ref="daypicker"
							modifiers={ modifiers }
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
		let { modeLabel, modeValue } = this.state;

		return (
			<div>
				{this.renderToggle()}
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={modeValue} />
				{this.renderControls()}
			</div>
		);
	}

});

module.exports = DateFilter;
