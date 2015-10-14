import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import { Button, InputGroup, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'DateField',

	focusTargetRef: 'dateInput',

	// default input format
	inputFormat: 'YYYY-MM-DD',

	getInitialState () {
		return {
			value: this.props.value ? this.moment(this.props.value).format(this.inputFormat) : this.moment(new Date()).format(this.inputFormat)
		};
	},

	getDefaultProps () {
		return {
			formatString: 'Do MMM YYYY'
		};
	},

	moment (value) {
		var m = moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return moment(value, this.inputFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (dateValue, format) {
		format = format || this.inputFormat;
		return dateValue ? this.moment(this.props.dateValue).format(format) : '';
	},

	setDate (dateValue) {
		this.setState({ value: dateValue });
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(dateValue) ? dateValue : null
		});
	},

	setToday () {
		this.setDate(moment().format(this.inputFormat));
	},

	valueChanged (value) {
		this.setDate(value);
	},

	renderField () {
		return (
			<InputGroup>
				<InputGroup.Section grow>
					<DateInput ref="dateInput" name={this.props.path} format={this.inputFormat} value={this.state.value} onChange={this.valueChanged} yearRange={this.props.yearRange} />
				</InputGroup.Section>
				<InputGroup.Section>
					<Button onClick={this.setToday}>Today</Button>
				</InputGroup.Section>
			</InputGroup>
		);
	},

	renderValue () {
		return <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
	}

});
