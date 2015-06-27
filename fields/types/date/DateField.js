var React = require('react');
var Field = require('../Field');
var Note = require('../../components/Note');
var DateInput = require('../../components/DateInput');
var moment = require('moment');

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

	renderUI: function() {
		
		var input;
		var fieldClassName = 'field-ui';

		if (this.shouldRenderField()) {
			input = (
				<div className={fieldClassName}>
					<DateInput ref="dateInput" name={this.props.path} format={this.inputFormat} value={this.state.value} onChange={this.valueChanged} yearRange={this.props.yearRange} />
					<button type="button" className="btn btn-default btn-set-today" onClick={this.setToday}>Today</button>
				</div>
			);
		} else {
			input = (
				<div className={fieldClassName}>
					<div className="field-value">{this.format(this.props.value, this.props.formatString)}</div>
				</div>
			);
		}
		
		return (
			<div className="field field-type-date">
				<label htmlFor={this.props.path} className="field-label">{this.props.label}</label>
				{input}
				<div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 field-note-wrapper">
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}

});
