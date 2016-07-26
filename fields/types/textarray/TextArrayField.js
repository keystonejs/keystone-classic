import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

module.exports = Field.create({
	displayName: 'TextArrayField',
	statics: {
		type: 'TextArray',
	},
	mixins: [ArrayFieldMixin],
});
