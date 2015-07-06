var React = require('react');
var Field = require('../Field');
var DateInput = require('../../components/DateInput');
var moment = require('moment');

var Button = require('elemental').Button;
var InputGroup = require('elemental').InputGroup;
var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'DateField',

	focusTargetRef: 'dateInput',

	// default input format
	inputFormat: 'YYYY-MM-DD',

	getInitialState: function() {
		return { 
			value: this.props.value ? this.moment(this.props.value).format(this.inputFormat) : ''
		};
	},

	getDefaultProps: function() {
		return { 
			formatString: 'Do MMM YYYY'
		};
	},

	moment: function(value) {
		var m = moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.inputFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(dateValue, format) {
		format = format || this.inputFormat;
		return dateValue ? this.moment(this.props.dateValue).format(format) : '';
	},

	setDate: function(dateValue) {
		this.setState({ value: dateValue });
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(dateValue) ? dateValue : null
		});
	},

	setToday: function() {
		this.setDate(moment().format(this.inputFormat));
	},

	valueChanged: function(value) {
		this.setDate(value);
	},
	
	renderField: function() {
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

	renderValue: function() {
		return <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
	}

});
