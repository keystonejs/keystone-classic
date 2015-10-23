import moment from 'moment';
import DayPicker from 'react-day-picker';
import React from 'react';
import Popout from '../../admin/client/components/Popout';
import { FormInput } from 'elemental';

function isSameDay(d1, d2) {
	if (!_.isDate(d1)) {
		d1 = new Date();
	}
	if (!_.isDate(d2)) {
		d2 = new Date();
	}
	d1.setHours(0, 0, 0, 0);
	d2.setHours(0, 0, 0, 0);

	return d1.getTime() === d2.getTime();
}

module.exports = React.createClass({

	displayName: 'DateInput',

	// set default properties
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD'
		};
	},

	getInitialState () {
		return {
			selectedDay: this.props.value,
			id: Math.round(Math.random() * 100000),
			pickerIsOpen: false
		};
	},

	// componentWillReceiveProps: function(newProps) {
	// 	console.log(moment(newProps.value).format("ddd MMMM DD YYYY hh:mm:ss a Z"));
	// 	if (newProps.value === this.state.selectedDay) return;
	// 	this.setState({
	// 		selectedDay: moment(newProps.value).format("ddd MMMM DD YYYY hh:mm:ss a Z")
	// 	});
	// },

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
		this.setState({
			pickerIsOpen: true
		});
	},

	handleBlur (e) {
	},

	render () {
		let { selectedDay } = this.state;

		let modifiers = {
			'selected': (day) => isSameDay(selectedDay, day)
		};

		return (
			<div>
				<FormInput
					autoComplete="off"
					id={this.state.id}
					name={this.props.name}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onChange={this.handleChange}
					placeholder={this.props.format}
					value={moment(selectedDay).format(this.props.format)} />
				<Popout
					isOpen={this.state.pickerIsOpen}
					onCancel={() => this.setState({ pickerIsOpen: false })}
					relativeToID={this.state.id}
					width={260}>
					<DayPicker
						modifiers={ modifiers }
						onDayClick={ this.handleChange }
						style={{ marginBottom: 9 }}
						tabIndex={-1} />
				</Popout>
			</div>
		);
		// return <FormInput name={this.props.name} value={this.state.value} placeholder={this.props.format} onChange={this.handleChange} onBlur={this.handleBlur} autoComplete="off" />;
	}

});
