var React = require('react');
var Field = require('../Field');
var DateInput = require('../../components/DateInput');
var moment = require('moment');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormNote = require('elemental').FormNote;
var FormRow = require('elemental').FormRow;
var InputGroup = require('elemental').InputGroup;

module.exports = Field.create({
	
	displayName: 'DatetimeField',

	focusTargetRef: 'dateInput',

	// default input formats
	dateInputFormat: 'YYYY-MM-DD',
	timeInputFormat: 'h:mm:ss a',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	getInitialState: function() {
		return { 
			dateValue: this.props.value ? moment(this.props.value).format(this.dateInputFormat) : '',
			timeValue: this.props.value ? moment(this.props.value).format(this.timeInputFormat) : ''
		};
	},

	getDefaultProps: function() {
		return { 
			formatString: 'Do MMM YYYY, h:mm:ss a'
		};
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.parseFormats).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? moment(value).format(format) : '';
	},

	handleChange: function(dateValue, timeValue) {
		var value = dateValue + ' ' + timeValue,
			datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? moment(value, datetimeFormat).toISOString() : null
		});
	},

	dateChanged: function(value) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged: function(event) {
		this.setState({ timeValue: event.target.value });
		this.handleChange(this.state.dateValue, event.target.value);
	},

	setNow: function() {
		var dateValue = moment().format(this.dateInputFormat),
			timeValue = moment().format(this.timeInputFormat);

		this.setState({
			dateValue: dateValue,
			timeValue: timeValue
		});
		this.handleChange(dateValue, timeValue);
	},

	renderUI: function() {
		
		var input;
		
		if (this.shouldRenderField()) {
			input = (
				<FormRow>
					<FormField width="one-half">
						<DateInput ref="dateInput" name={this.props.paths.date} value={this.state.dateValue} format={this.dateInputFormat} onChange={this.dateChanged} />
					</FormField>
					<FormField width="one-half">
						<InputGroup>
							<InputGroup.Section grow>
								<FormInput name={this.props.paths.time} value={this.state.timeValue} placeholder="HH:MM:SS am/pm" onChange={this.timeChanged} autoComplete="off" />
							</InputGroup.Section>
							<InputGroup.Section>
								<Button onClick={this.setNow}>Now</Button>
							</InputGroup.Section>
						</InputGroup>
					</FormField>
				</FormRow>
			);
		} else {
			input = <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
		}
		
		return (
			<FormField label={this.props.label} className="field-type-datetime">
				{input}
				<FormNote note={this.props.note} />
			</FormField>
		);
	}

});
