import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import { Button, FormField, FormInput, FormNote, InputGroup } from 'elemental';

module.exports = Field.create({

	displayName: 'DatetimeField',

	focusTargetRef: 'dateInput',

	// default input formats
	dateInputFormat: 'YYYY-MM-DD',
	timeInputFormat: 'h:mm:ss a',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	getInitialState () {
		return {
			dateValue: this.props.value && this.moment(this.props.value).format(this.dateInputFormat),
			timeValue: this.props.value && this.moment(this.props.value).format(this.timeInputFormat)
		};
	},

	getDefaultProps () {
		return {
			formatString: 'Do MMM YYYY, h:mm:ss a'
		};
	},

	moment (value) {
		var m = moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return moment(value, this.parseFormats).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? this.moment(value).format(format) : '';
	},

	handleChange (dateValue, timeValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? moment(value, datetimeFormat).toISOString() : null
		});
	},

	dateChanged (value) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged (event) {
		this.setState({ timeValue: event.target.value });
		this.handleChange(this.state.dateValue, event.target.value);
	},

	setNow () {
		var dateValue = moment().format(this.dateInputFormat);
		var timeValue = moment().format(this.timeInputFormat);
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue
		});
		this.handleChange(dateValue, timeValue);
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		var input;
		var fieldClassName = 'field-ui';
		if (this.shouldRenderField()) {
			input = (
				<InputGroup>
					<InputGroup.Section grow>
						<DateInput ref="dateInput" name={this.props.paths.date} value={this.state.dateValue} format={this.dateInputFormat} onChange={this.dateChanged} />
					</InputGroup.Section>
					<InputGroup.Section grow>
						<FormInput name={this.props.paths.time} value={this.state.timeValue} placeholder="HH:MM:SS am/pm" onChange={this.timeChanged} autoComplete="off" />
					</InputGroup.Section>
					<InputGroup.Section>
						<Button onClick={this.setNow}>Now</Button>
					</InputGroup.Section>
				</InputGroup>
			);
		} else {
			input = <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
		}
		return (
			<FormField label={this.props.label} className="field-type-datetime">
				{input}
				{this.renderNote()}
			</FormField>
		);
	}
});
