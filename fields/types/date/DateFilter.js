import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';

import { Button, InputGroup, FormField, FormInput, FormRow, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

const MODE_OPTIONS = [
	{ label: 'On',      value: 'on' },
	{ label: 'After',   value: 'after' },
	{ label: 'Before',  value: 'before' },
	{ label: 'Between', value: 'between' }
];

let CLOCK_OPTIONS = {
	get hour () {
		return Array.apply(null, new Array(24)).map((_,i) => { return { label: i, value: i }; });
	},
	get min () {
		return Array.apply(null, new Array(60)).map((_,i) => { return { label: i, value: i }; });
	}
};
CLOCK_OPTIONS.sec = CLOCK_OPTIONS.min;

var DayPickerIndicator = React.createClass({
	render () {
		return (
			<span className="DayPicker-Indicator">
				<span className="DayPicker-Indicator__border" />
				<span className="DayPicker-Indicator__bg" />
			</span>
		);
	}
});

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: TOGGLE_OPTIONS[0].value,
		value: moment(0, 'HH').format(),
		before: moment(0, 'HH').format(),
		after: moment(0, 'HH').format(),
		time: {
			before: {},
			after: {},
			value: {}
		}
	};
}

var DateFilter = React.createClass({
	
	displayName: 'DateFilter',
	
	statics: {
		getDefaultValue: getDefaultValue,
	},
	
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: React.PropTypes.boolean
		})
	},
	
	getInitialState () {
		return {
			activeInputField: 'after',
			month: new Date(), // The month to display in the calendar
		};
	},
	
	getDefaultProps () {
		return {
			format: 'DD-MM-YYYY',
			filter: getDefaultValue(),
			value: moment().startOf('day').toDate()
		};
	},
	
	componentDidMount () {
		// focus the text input
		if (this.props.filter.mode === 'between') {
			React.findDOMNode(this.refs[this.state.activeInputField]).focus();
		} else {
			React.findDOMNode(this.refs.input).focus();
		}
		
	},
	
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	
	toggleInverted (value) {
		this.updateFilter({ inverted: value });
		React.findDOMNode(this.refs.input).focus();
	},
	
	selectMode (mode) {
		this.updateFilter({ mode });
		if (mode === 'between') {
			setTimeout(() => { React.findDOMNode(this.refs[this.state.activeInputField]).focus(); },100);
		} else {
			setTimeout(() => { React.findDOMNode(this.refs.input).focus(); },100);
		}
		
		
	},
	
	handleInputChange(e) {
		const { value } = e.target;
		let { month } = this.state;

		// Change the current month only if the value entered by the user is a valid
		// date, according to the `L` format
		if (moment(value, 'L', true).isValid()) {
		  month = moment(value, 'L').toDate();
		}
		
		this.updateFilter({ value: this.addTimeToStamp(value, 'value') });
		this.setState({ month }, this.showCurrentDate);
	},
	
	setActiveInputField (input) {
		this.setState({ 
			activeInputField: input
		});
	},
	
	switchBetweenActiveInputFields (e, day, modifiers) {
		if (modifiers.indexOf('disabled') > -1) return;
		
		const { activeInputField } = this.state;
		let send = {};
		send[activeInputField] = this.addTimeToStamp(day, activeInputField);
		this.updateFilter(send);

		const newActiveField = ( activeInputField === 'before' ) ? 'after' : 'before';
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				React.findDOMNode(this.refs[newActiveField]).focus();
			}
		);
	},
	
	selectDay (e, day, modifiers) {
		if (modifiers.indexOf('disabled') > -1) return;
		this.updateFilter({ value: this.addTimeToStamp(day, 'value') });
	},
	
	showCurrentDate() {
		this.refs.daypicker.showMonth(this.state.month);
	},
	
	addTimeToStamp (stamp, who, time) {
		if(!time) {
			time = this.props.filter.time;
		}
		if (!this.props.field.type === 'datetime') {
			return stamp;
		}
		return moment(stamp).set( { 'hour': time[who].hour || 0, 'minute': time[who].min || 0, 'second': time[who].sec || 0 } ).toDate();
	},
	
	updateTime(who, saveAs, saveValue) {
		const filter = { ...this.props.filter };
		filter.time[saveAs][who] = saveValue;
		filter[saveAs] = this.addTimeToStamp(filter[saveAs], saveAs, filter.time);
		this.updateFilter(filter);
	},
	
	renderToggle () {
		const { filter } = this.props;
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},
	
	renderTime(before) {
		const { field, filter } = this.props;
		const { time } = filter;
		const bORa = before ? 'before' : 'after';
		const mode = MODE_OPTIONS.filter((i => i.value === filter.mode))[0];

		if (field.type === 'datetime') {
			var updateTime = (who, saveAs) => {
				return (
					<FormSelect 
						name={who}
						options={CLOCK_OPTIONS[who]}
						value={time[saveAs][who]}
						onChange={(value) => { this.updateTime(who, saveAs, value); }}
					/>
				);
			};
			
			if (mode.value !== 'between') {
				return (
					<FormRow>
						<FormField width="one-third">
							{updateTime('hour', 'value')}
						</FormField>
						<FormField width="one-third">
							{updateTime('min', 'value')}
						</FormField>
						<FormField width="one-third">
							{updateTime('sec', 'value')}
						</FormField>
					</FormRow>
				);
			} else {
				return (
					<div>
						<InputGroup contiguous>
							<InputGroup.Section >
								<Button disabled={true} ><div style={ { width:25 } }>hour</div></Button>
							</InputGroup.Section>
							<InputGroup.Section grow>
								{updateTime('hour', bORa)}
							</InputGroup.Section>
						</InputGroup>
						<InputGroup contiguous>
							<InputGroup.Section >
								<Button disabled={true} ><div style={ { width:25 } }>min </div></Button>
							</InputGroup.Section>
							<InputGroup.Section grow>
								{updateTime('min', bORa)}
							</InputGroup.Section>
						</InputGroup>
						<InputGroup contiguous>
							<InputGroup.Section >
								<Button disabled={true} ><div style={ { width:25 } }>sec </div></Button>
							</InputGroup.Section>
							<InputGroup.Section grow>
								{updateTime('sec', bORa)}
							</InputGroup.Section>
						</InputGroup>
					</div>
				);
			}
		}
	},
	
	renderControls () {
		let controls;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter((i => i.value === filter.mode))[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';
		// DayPicker stuff
		const modifiers = {
			'selected': (day) => moment(filter.value).isSame(day)
		};

		if (mode.value === 'between') {
			controls = (
				<div>
					<FormRow>
						<FormField width="one-half">
							{this.renderTime()}
							<FormInput ref="after" placeholder="From" onFocus={(e) => { this.setActiveInputField('after'); }}  value={moment(filter.after).format(this.props.format)} />
							
						</FormField>
						<FormField width="one-half">
							{this.renderTime(true)}
							<FormInput ref="before" placeholder="To"  onFocus={(e) => { this.setActiveInputField('before'); }} value={moment(filter.before).format(this.props.format)} />
							
						</FormField>
					</FormRow>						
					<div style={{ position: 'relative' }}>
						<DayPicker
							modifiers={ modifiers }
							className="DayPicker--chrome"
							onDayClick={ this.switchBetweenActiveInputFields }
						/> <DayPickerIndicator />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<FormField>
						<FormInput
							ref="input"
							placeholder={placeholder}
							value={moment(filter.value).format(this.props.format)}
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
						/>
					</FormField>
					{this.renderTime()}
					<div style={{ position: 'relative' }}>
						 <DayPicker
							ref="daypicker"
							modifiers={ modifiers }
							className="DayPicker--chrome"
							onDayClick={this.selectDay}
						/> <DayPickerIndicator />
					</div>
				</div>
			);
		}

		return controls;
	},
	
	render () {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter((i => i.value === filter.mode))[0];
		return (
			<div>
				{this.renderToggle()}
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={mode.value} />
				{this.renderControls()}
			</div>
		);
	}

});

module.exports = DateFilter;
