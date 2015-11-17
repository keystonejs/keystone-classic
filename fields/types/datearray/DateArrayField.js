import ArrayFieldMixin from '../../mixins/ArrayField';
import DateInput from '../../components/DateInput';
import Field from '../Field';
import React from 'react';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

module.exports = Field.create({

	displayName: 'DateArrayField',
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
		let m = moment(value);
		return m.isValid() ? m.format(this.props.inputFormat) : value;
	},

	formatValue (value) {
		return value ? this.moment(value).format(this.props.formatString) : '';
	},

	getInputComponent () {
		return DateInput;
	},

});
