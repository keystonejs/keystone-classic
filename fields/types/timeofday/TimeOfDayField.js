import DateInput from '../../components/DateInput'
import Field from '../Field'
import moment from 'moment'
import React from 'react'
import { Button, FormField, FormInput, FormNote, InputGroup } from 'elemental'

module.exports = Field.create({

	displayName: 'TimeOfDayField',

	focusTargetRef: 'dateInput',

	// default input formats
	timeInputFormat: 'h:mm a',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['h:m a', 'H:m'],

	getInitialState () {
		return {
			timeValue: this.props.value && this.moment(this.props.value).format(this.timeInputFormat)
		}
	},

	getDefaultProps () {
		return {
			formatString: 'Do h:mm a',
		}
	},

	moment (value) {
		var m = moment(value)
		if (this.props.isUTC) m.utc()
		return m
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return moment(value, this.parseFormats).isValid()
	},

	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.timeInputFormat
		return value ? this.moment(value).format(format) : ''
	},

	handleChange () {
		var value = this.state.timeValue
		var timeFormat = this.timeInputFormat
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? moment(value, timeFormat).toISOString() : null,
		})
	},

	timeChanged (evt) {
		this.setState({ timeValue: evt.target.value })
		this.handleChange()
	},

	setNow () {
		var timeValue = moment().format(this.timeInputFormat)
		this.setState({
			timeValue: timeValue,
		})
		this.handleChange(timeValue)
	},

	renderNote () {
		if (!this.props.note) return null
		return <FormNote note={this.props.note} />
	},

	renderUI () {
		var input
		var fieldClassName = 'field-ui'
		if (this.shouldRenderField()) {
			input = (
				<InputGroup>
					<InputGroup.Section grow>
						<FormInput name={this.props.paths.time} value={this.state.timeValue} placeholder="HH:MM:SS am/pm" onChange={this.timeChanged} autoComplete="off" />
					</InputGroup.Section>
					<InputGroup.Section>
						<Button onClick={this.setNow}>Now</Button>
					</InputGroup.Section>
				</InputGroup>
			)
		} else {
			input = <FormInput noedit>{this.format(this.props.value, this.props.formatString)}</FormInput>
		}
		return (
			<FormField label={this.props.label} className="field-type-datetime">
				{input}
				{this.renderNote()}
			</FormField>
		)
	},
})
