import ArrayFieldMixin from '../../mixins/ArrayField';
import DateInput from '../../components/DateInput';
import Field from '../Field';
import React from 'react';
import moment from 'moment';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

module.exports = Field.create({

	displayName: 'DateArrayField',
	statics: {
		type: 'DateArray',
	},
	mixins: [ArrayFieldMixin],

	propTypes: {
		formatString: React.PropTypes.string,
		inputFormat: React.PropTypes.string,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
		};
	},

	processInputValue (value) {
		if (!value) return;
		const m = moment(value);
		return m.isValid() ? m.format(this.props.inputFormat) : value;
	},

	formatValue (value) {
		return value ? moment(value).format(this.props.formatString) : '';
	},

	getInputComponent () {
		return DateInput;
	},

});
