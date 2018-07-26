import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

module.exports = Field.create({

	displayName: 'NumberArrayField',
	statics: {
		type: 'NumberArray',
	},

	mixins: [ArrayFieldMixin],

	isValid (input) {
		return /^-?\d*\.?\d*$/.test(input);
	},

});
