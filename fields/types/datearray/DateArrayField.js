import Field from '../Field';
import ArrayFieldMixin from '../../mixins/DateArrayField';

module.exports = Field.create({
	displayName: 'DateArrayField',
	mixins: [ArrayFieldMixin]
});
