import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import { Button, FormRow, FormField, FormInput, FormNote, InputGroup } from 'elemental';
import Select from 'react-select';

let CLOCK_OPTIONS = {
	get hour () {
		return Array.apply(null, new Array(12)).map((_,i) => { return { label: i+1, value: i+1 }; });
	},
	get min () {
		return Array.apply(null, new Array(60)).map((_,i) => { return { label: i, value: i }; });
	}
};
CLOCK_OPTIONS.sec = CLOCK_OPTIONS.min;

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
			dateValue: this.props.value ? this.moment(this.props.value).format(this.dateInputFormat) : this.moment().format(this.dateInputFormat),
			timeValue: this.props.value ? this.moment(this.props.value).format(this.timeInputFormat) : this.moment().format(this.timeInputFormat)
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

	timeChanged (who, val) {
		
		const { dateValue, timeValue } = this.state;
		let m = this.moment(dateValue + ' ' + timeValue);

		// set the requested value
		if (who !== 'ampm') {
			
			if (who === 'hour' && m.format('a') === 'pm') {
				m[who](val.value + 12);
			} else {
				m[who](val.value);	
			}
			
		} else {
			
			if(val.value === 'pm') {
				m.add(12, 'hours');
			} else {
				m.subtract(12, 'hours');
			}
			
		}
		
		const time = m.format('h') + ':' + m.format('m') + ':' + m.format('s') + ' ' + m.format('a');
			
		this.setState({ timeValue: time });
		this.handleChange(dateValue, time);
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
	
	renderHiddenInput () {
		const { timeValue, dateValue } = this.state;
		return (<input type="hidden" name={this.props.path} value={dateValue + ' ' + timeValue} />);
	},
	
	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},
	
	renderOption: function(option) {
		return <span style={{ color: 'black' }}>{option.label}</span>;
	},
	
	renderUI () {
		var input;
		var fieldClassName = 'field-ui';
		const { timeValue, dateValue } = this.state;
		const ampm = [
			{ value: 'am', label: 'am' },
			{ value: 'pm', label: 'pm' }
		];
		if (this.shouldRenderField()) {
			const time = moment(dateValue + ' ' + timeValue);
			input = (
				<InputGroup>
					<InputGroup.Section grow>
						<DateInput ref="dateInput" name={this.props.paths.date} value={dateValue} format={this.dateInputFormat} onChange={this.dateChanged} />
					</InputGroup.Section>
					<InputGroup.Section grow>
						<Select
							labelKey="hour"
							onChange={ (v) => { this.timeChanged('hour', v); } }
							value={Number(time.format('h'))}
							options={CLOCK_OPTIONS.hour}
							optionRenderer={this.renderOption}
							valueRenderer={this.renderOption}
							clearable={false}
						/>
					</InputGroup.Section>
					<InputGroup.Section grow>
						<Select
							labelKey="min"
							onChange={ (v) => { this.timeChanged('minutes', v); } }
							value={Number(time.format('m'))}
							options={CLOCK_OPTIONS.min}
							optionRenderer={this.renderOption}
							valueRenderer={this.renderOption}
							clearable={false}
						/>
					</InputGroup.Section>
					<InputGroup.Section grow>
						<Select
							labelKey="sec"
							onChange={ (v) => { this.timeChanged('seconds', v); } }
							value={Number(time.format('s'))}
							options={CLOCK_OPTIONS.sec}
							optionRenderer={this.renderOption}
							valueRenderer={this.renderOption}
							clearable={false}
						/>
					</InputGroup.Section>
					<InputGroup.Section grow>
						<Select
							labelKey="am/pm"
							onChange={ (v) => { this.timeChanged('ampm', v); } }
							value={time.format('a')}
							options={ampm}
							optionRenderer={this.renderOption}
							valueRenderer={this.renderOption}
							clearable={false}
						/>
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
				{this.renderHiddenInput()}
				{this.renderNote()}
			</FormField>
		);
	}
});
