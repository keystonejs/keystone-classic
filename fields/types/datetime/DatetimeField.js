import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import {
	Button,
	FormField,
	FormInput,
	FormNote,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

module.exports = Field.create({

	displayName: 'DatetimeField',
	statics: {
		type: 'Datetime',
	},

	focusTargetRef: 'dateInput',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	getInitialState () {
		return {
			dateValue: this.props.value && this.moment(this.props.value).format(this.getDateInputFormat()),
			timeValue: this.props.value && this.moment(this.props.value).format(this.getTimeInputFormat()),
			tzOffsetValue: this.props.value ? this.moment(this.props.value).format(this.getTzInputFormat()) : this.moment().format(this.getTzInputFormat()),
		};
	},

	getDateInputFormat () {
		return this.props.formatDateString;
	},

	getTimeInputFormat () {
		return this.props.formatTimeString;
	},

	getTzInputFormat () {
		return this.props.formatTzString;
	},

	getDefaultProps () {
		return {
			formatDateString: 'YYYY-MM-DD',
			formatTimeString: 'h:mm:ss a',
		};
	},

	moment () {
		if (this.props.isUTC) return moment.utc.apply(moment, arguments);
		else return moment.apply(undefined, arguments);
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return this.moment(value, this.parseFormats).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.getDateInputFormat() + ' ' + this.getTimeInputFormat();
		return value ? this.moment(value).format(format) : '';
	},

	handleChange (dateValue, timeValue, tzOffsetValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.getDateInputFormat() + ' ' + this.getTimeInputFormat();

		// if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
		if (typeof tzOffsetValue !== 'undefined') {
			value += ' ' + tzOffsetValue;
			datetimeFormat += ' ' + this.getTzInputFormat();
		}
		// if not, calculate the timezone offset based on the date (respect different DST values)
		else {
			this.setState({ tzOffsetValue: this.moment(value, datetimeFormat).format(this.getTzInputFormat()) });
		}

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? this.moment(value, datetimeFormat).toISOString() : null,
		});
	},

	dateChanged ({ value }) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged (evt) {
		this.setState({ timeValue: evt.target.value });
		this.handleChange(this.state.dateValue, evt.target.value);
	},

	setNow () {
		var dateValue = this.moment().format(this.getDateInputFormat());
		var timeValue = this.moment().format(this.getTimeInputFormat());
		var tzOffsetValue = this.moment().format(this.getTzInputFormat());
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue,
			tzOffsetValue: tzOffsetValue,
		});
		this.handleChange(dateValue, timeValue, tzOffsetValue);
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		var input;
		if (this.shouldRenderField()) {
			input = (
				<div>
					<Group>
						<Section grow>
							<DateInput
								format={this.getDateInputFormat()}
								name={this.getInputName(this.props.paths.date)}
								onChange={this.dateChanged}
								ref="dateInput"
								value={this.state.dateValue}
							/>
						</Section>
						<Section grow>
							<FormInput
								autoComplete="off"
								name={this.getInputName(this.props.paths.time)}
								onChange={this.timeChanged}
								placeholder={this.getTimeInputFormat()}
								value={this.state.timeValue}
							/>
						</Section>
						<Section>
							<Button onClick={this.setNow}>Now</Button>
						</Section>
					</Group>
					<input
						name={this.getInputName(this.props.paths.tzOffset)}
						type="hidden"
						value={this.state.tzOffsetValue}
					/>
				</div>
			);
		} else {
			input = (
				<FormInput noedit>
					{this.format(this.props.value, this.props.formatString)}
				</FormInput>
			);
		}
		return (
			<FormField label={this.props.label} className="field-type-datetime" htmlFor={this.getInputName(this.props.path)}>
				{input}
				{this.renderNote()}
			</FormField>
		);
	},
});
