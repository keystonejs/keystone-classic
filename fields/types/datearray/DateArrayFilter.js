import React from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import {
	FormInput,
	FormSelect,
	Grid,
} from '../../../admin/client/App/elemental';

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
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
		presence: PRESENCE_OPTIONS[0].value,
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
			presence: React.PropTypes.string,
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
			findDOMNode(this.refs[this.state.activeInputField]).focus();
		} else {
			findDOMNode(this.refs.input).focus();
		}
	},
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	selectPresence (e) {
		const presence = e.target.value;
		this.updateFilter({ presence });
		findDOMNode(this.refs.input).focus();
	},
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		if (mode === 'between') {
			setTimeout(() => { findDOMNode(this.refs[this.state.activeInputField]).focus(); }, 200);
		} else {
			findDOMNode(this.refs.input).focus();
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
		if (modifiers && modifiers.disabled) return;
		const { activeInputField } = this.state;
		const send = {};
		send[activeInputField] = day;
		this.updateFilter(send);
		const newActiveField = (activeInputField === 'before') ? 'after' : 'before';
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				findDOMNode(this.refs[newActiveField]).focus();
			}
		);
	},
	selectDay (e, day, modifiers) {
		if (modifiers && modifiers.disabled) return;
		this.updateFilter({ value: day });
	},
	showCurrentDate () {
		this.refs.daypicker.showMonth(this.state.month);
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
					<div style={{ marginBottom: '1em' }}>
						<Grid.Row xsmall="one-half" gutter={10}>
							<Grid.Col>
								<FormInput ref="after" placeholder="From" onFocus={(e) => { this.setActiveField('after'); }} value={moment(filter.after).format(this.props.format)} />
							</Grid.Col>
							<Grid.Col>
								<FormInput ref="before" placeholder="To" onFocus={(e) => { this.setActiveField('before'); }} value={moment(filter.before).format(this.props.format)} />
							</Grid.Col>
						</Grid.Row>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							className="DayPicker--chrome"
							modifiers={modifiers}
							onDayClick={this.switchBetweenActiveInputFields}
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<FormInput
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
							placeholder={placeholder}
							ref="input"
							value={moment(filter.value).format(this.props.format)}
						/>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							className="DayPicker--chrome"
							modifiers={modifiers}
							onDayClick={this.selectDay}
							ref="daypicker"
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
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

		return (
			<div>
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						onChange={this.selectPresence}
						options={PRESENCE_OPTIONS}
						value={presence.value}
					/>
				</div>
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						onChange={this.selectMode}
						options={MODE_OPTIONS}
						value={mode.value}
					/>
				</div>
				{this.renderControls()}
			</div>
		);
	},
});

module.exports = DateFilter;
