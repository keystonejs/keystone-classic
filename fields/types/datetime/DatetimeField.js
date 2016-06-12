var React = require('react');
var Field = require('../Field');
var Note = require('../../components/Note');
var DateInput = require('../../components/DateInput');
var moment = require('moment');

module.exports = Field.create({

	displayName: 'DatetimeField',

	focusTargetRef: 'dateInput',

	getInitialState: function() {
		return {
			dateValue: this.props.value ? this.moment(this.props.value).format(this.props.dateFormat) : '',
			timeValue: this.props.value ? this.moment(this.props.value).format(this.props.timeFormat) : ''
		};
	},

	getDefaultProps: function() {
		return {
			formatString: 'YYYY-MM-DD, h:mm a'
		};
	},

	moment: function(value) {
		var m = moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.props.formatString).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(value, format) {
		format = format || this.props.dateFormat + ' ' + this.props.timeFormat;
		return value ? this.moment(value).format(format) : '';
	},

	handleChange: function(dateValue, timeValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.props.dateFormat + ' ' + this.props.timeFormat;
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
		var dateValue = moment().format(this.props.dateFormat);
		var timeValue = moment().format(this.props.timeFormat);
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue
		});
		this.handleChange(dateValue, timeValue);
	},

	renderUI: function() {
		var input;
		var fieldClassName = 'field-ui';
		if (this.shouldRenderField()) {
			input = (
				<div className={fieldClassName}>
					<DateInput ref="dateInput" name={this.props.paths.date} value={this.state.dateValue} placeholder={this.props.datePlaceholder} format={this.props.dateFormat} onChange={this.dateChanged} />
					<input type="text" name={this.props.paths.time} value={this.state.timeValue} placeholder={this.props.timePlaceholder} onChange={this.timeChanged} autoComplete="off" className="form-control time" />
					<button type="button" className="btn btn-default btn-set-now" onClick={this.setNow}>Now</button>
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
			<div className="field field-type-datetime">
				<label className="field-label">{this.props.label}</label>
				{input}
				<div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 field-note-wrapper">
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}
});
