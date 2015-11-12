import moment from 'moment';
import DayPicker from 'react-day-picker';
import React from 'react';
import ReactDOM from 'react-dom';
import Popout from '../../admin/client/components/Popout';
import { FormInput } from 'elemental';

let lastId = 0;

module.exports = React.createClass({

	displayName: 'DateInput',

	// set default properties
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},

	getInitialState () {
		return {
			selectedDay: this.props.value,
			id: `_DateInput_${++lastId}`,
			pickerIsOpen: false,
		};
	},

	// componentWillReceiveProps: function(newProps) {
	// 	console.log(moment(newProps.value).format("ddd MMMM DD YYYY hh:mm:ss a Z"));
	// 	if (newProps.value === this.state.selectedDay) return;
	// 	this.setState({
	// 		selectedDay: moment(newProps.value).format("ddd MMMM DD YYYY hh:mm:ss a Z")
	// 	});
	// },

	focus () {
		if (!this.refs.input) return;
		this.refs.input.focus();
	},

	handleChange (e, day) {
		this.setState({
			selectedDay: day
		}, () => {
			setTimeout(() => {
				this.setState({
					pickerIsOpen: false
				});
			}, 200);
		});
	},

	handleFocus (e) {
		if (this.state.pickerIsOpen) return;
		this.setState({
			pickerIsOpen: true,
		});
	},

	handleBlur (e) {
		let rt = e.relatedTarget;
		let popout = this.refs.popout.getPortalDOMNode();
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		this.setState({
			pickerIsOpen: false
		});
	},

	render () {
		let { selectedDay } = this.state;

		let modifiers = {
			selected: (day) => moment(selectedDay).isSame(day),
		};

		return (
			<div ref="container">
				<FormInput
					autoComplete="off"
					id={this.state.id}
					name={this.props.name}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onChange={this.handleChange}
					placeholder={this.props.format}
					ref="input"
					value={moment(selectedDay).format(this.props.format)} />
				<Popout
					ref="popout"
					isOpen={this.state.pickerIsOpen}
					onCancel={() => this.setState({ pickerIsOpen: false })}
					relativeToID={this.state.id}
					width={260}>
					<DayPicker
						modifiers={modifiers}
						onDayClick={this.handleChange}
						tabIndex={-1} />
				</Popout>
			</div>
		);
		// return <FormInput name={this.props.name} value={this.state.value} placeholder={this.props.format} onChange={this.handleChange} onBlur={this.handleBlur} autoComplete="off" />;
	}

});
