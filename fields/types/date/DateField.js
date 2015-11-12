import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import { Button, InputGroup, FormInput } from 'elemental';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

module.exports = Field.create({

	displayName: 'DateField',

	propTypes: {
		formatString: React.PropTypes.string,
		inputFormat: React.PropTypes.string,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.date,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
		};
	},

	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? value : null
		});
	},

	moment (value) {
		var m = moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	isValid (value) {
		return moment(value, this.inputFormat).isValid();
	},

	format (value) {
		return value ? this.moment(value).format(this.props.formatString) : '';
	},

	setToday () {
		this.valueChanged(new Date());
	},

	renderValue () {
		return <FormInput noedit>{this.format(this.props.value)}</FormInput>;
	},

	renderField () {
		return (
			<InputGroup>
				<InputGroup.Section grow>
					<DateInput ref="dateInput" name={this.props.path} format={this.props.inputFormat} value={this.state.value} onChange={this.valueChanged} yearRange={this.props.yearRange} />
				</InputGroup.Section>
				<InputGroup.Section>
					<Button onClick={this.setToday}>Today</Button>
				</InputGroup.Section>
			</InputGroup>
		);
	}

});
