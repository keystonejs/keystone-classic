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
		indent: React.PropTypes.bool,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.date,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING
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

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return moment(value, this.inputFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (dateValue, formatString) {
		formatString = formatString || DEFAULT_FORMAT_STRING;
		return dateValue ? this.moment(this.props.dateValue).format(formatString) : '';
	},

	setToday () {
		this.valueChanged(new Date());
	},

	renderValue () {
		return <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
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
	}

});
