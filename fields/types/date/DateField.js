var React = require('react');
var Field = require('../Field');
var DateInput = require('../../components/DateInput');
var moment = require('moment');

var InputGroup = require('elemental').InputGroup;
var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'DateField',

	focusTargetRef: 'dateInput',

	// default formats
	inputFormat: 'YYYY-MM-DD',

	getInitialState: function() {
		return { 
			value: this.props.value ? moment(this.props.value).format(this.inputFormat) : ''
		};
	},

	getDefaultProps: function() {
		return { 
			formatString: 'Do MMM YYYY'
		};
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.inputFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(dateValue, format) {
		format = format || this.inputFormat;
		return dateValue ? moment(this.props.dateValue).format(format) : '';
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
		// TODO: Currently ignores inputProps
		return (
			<InputGroup>
				<DateInput ref="dateInput" name={this.props.path} format={this.inputFormat} value={this.state.value} onChange={this.valueChanged} yearRange={this.props.yearRange} />
				<InputGroup.Addon onClick={this.setToday}>Today</InputGroup.Addon>
			</InputGroup>
		);
	},

	renderValue: function() {
		return <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>;
	}

});
