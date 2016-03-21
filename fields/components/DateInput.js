import moment from 'moment';
import DayPicker from 'react-day-picker';
import React from 'react';
import ReactDOM from 'react-dom';
import Popout from '../../admin/client/components/Popout';
import { FormInput } from 'elemental';

let lastId = 0;

module.exports = React.createClass({
	displayName: 'DateInput',
	propTypes: {
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
	},
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},
	getInitialState () {
		const id = ++lastId;
		let month = new Date();
		const { format, value } = this.props;
		if (moment(value, format, true).isValid()) {
			month = moment(value, format).toDate();
		}
		return {
			id: `_DateInput_${id}`,
			month: month,
			pickerIsOpen: false,
		};
	},
	componentDidMount () {
		this.showCurrentMonth();
	},
	componentWillReceiveProps: function (newProps) {
		if (newProps.value === this.props.value) return;
		this.setState({
			month: moment(newProps.value, this.props.format).toDate(),
			inputValue: newProps.value,
		}, this.showCurrentMonth);
	},
	focus () {
		if (!this.refs.input) return;
		this.refs.input.focus();
	},
	handleInputChange (e) {
		const { value } = e.target;
		this.setState({ inputValue: value }, this.showCurrentMonth);
	},
	handleKeyPress (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const parsedDate = moment(this.state.inputValue, this.props.format);
			// If the date is strictly equal to the format string, dispatch onChange
			if (moment(this.state.inputValue, this.props.format, true).isValid()) {
				this.props.onChange({ value: this.state.inputValue });
			// If the date is not strictly equal, only change the tab that is displayed
			} else if (moment(this.state.inputValue, this.props.format).isValid()) {
				this.setState({
					month: moment(this.state.inputValue, this.props.format).toDate(),
				}, this.showCurrentMonth);
			}
		}
	},
	handleDaySelect (e, date, modifiers) {
		if (modifiers.indexOf('disabled') > -1) {
			return;
		}
		var value = moment(date).format(this.props.format);
		this.props.onChange({ value });
		this.setState({
			pickerIsOpen: false,
			month: date,
			inputValue: value,
		});
	},
	showPicker () {
		this.setState({ pickerIsOpen: true }, this.showCurrentMonth);
	},
	showCurrentMonth () {
		if (!this.refs.picker) return;
		this.refs.picker.showMonth(this.state.month);
	},
	handleFocus (e) {
		if (this.state.pickerIsOpen) return;
		this.showPicker();
	},
	handleBlur (e) {
		let rt = e.relatedTarget;
		const popout = this.refs.popout.getPortalDOMNode();
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		this.setState({
			pickerIsOpen: false,
		});
	},
	render () {
		const selectedDay = this.props.value;
		// react-day-picker adds a class to the selected day based on this
		const modifiers = {
			selected: (day) => moment(day).format(this.props.format) === selectedDay,
		};

		return (
			<div>
				<FormInput
					autoComplete="off"
					id={this.state.id}
					name={this.props.name}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onChange={this.handleInputChange}
					placeholder={this.props.format}
					ref="input"
					onKeyPress={this.handleKeyPress}
					value={this.state.inputValue} />
				<Popout
					ref="popout"
					isOpen={this.state.pickerIsOpen}
					onCancel={() => this.setState({ pickerIsOpen: false })}
					relativeToID={this.state.id}
					width={260}>
					<DayPicker
						ref="picker"
						modifiers={modifiers}
						onDayClick={this.handleDaySelect}
						tabIndex={-1} />
				</Popout>
			</div>
		);
	},
});
