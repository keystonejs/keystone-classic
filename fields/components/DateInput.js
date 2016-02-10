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
		path: React.PropTypes.string,
		value: React.PropTypes.string,
	},
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},
	getInitialState () {
		let id = ++lastId;
		let month = new Date();
		let { format, value } = this.props;
		if (moment(value, format, true).isValid()) {
			month = moment(value, format).toDate();
		}
		return {
			value: value,
			id: `_DateInput_${id}`,
			month: new Date(),
			pickerIsOpen: false,
		};
	},
	componentDidMount () {
		this.showCurrentDate();
	},
	componentWillReceiveProps: function (newProps) {
		if (newProps.value === this.state.value) return;
		this.setState({
			value: newProps.value,
		});
	},
	focus () {
		if (!this.refs.input) return;
		this.refs.input.focus();
	},
	handleInputChange (e) {
		const { value } = e.target;
		let { month } = this.state;
		if (moment(value, this.props.format, true).isValid()) {
			month = moment(value, this.props.format).toDate();
		}
		this.setState({ value, month }, this.showCurrentDate);
	},
	handleDaySelect (e, day, modifiers) {
		if (modifiers.indexOf('disabled') > -1) {
			return;
		}
		this.setState({
			value: moment(day).format(this.props.format),
			month: day,
		}, () => {
			setTimeout(() => {
				this.setState({
					pickerIsOpen: false,
				});
			}, 200);
		});
	},
	showPicker () {
		this.setState({ pickerIsOpen: true }, this.showCurrentDate);
	},
	showCurrentDate () {
		if (!this.refs.picker) return;
		this.refs.picker.showMonth(this.state.month);
	},
	handleFocus (e) {
		if (this.state.pickerIsOpen) return;
		this.showPicker();
	},
	handleBlur (e) {
		let rt = e.relatedTarget;
		let popout = this.refs.popout.getPortalDOMNode();
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		this.setState({
			pickerIsOpen: false,
		});
	},
	render () {
		const selectedDay = this.state.value;
		let modifiers = {
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
					value={this.state.value} />
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
