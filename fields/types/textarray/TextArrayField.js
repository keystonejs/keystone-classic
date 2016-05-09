import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

module.exports = Field.create({
	displayName: 'TextArrayField',
	mixins: [ArrayFieldMixin],
});
