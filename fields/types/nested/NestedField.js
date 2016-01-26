import Field from '../Field';

module.exports = Field.create({
	displayName: 'NestedField',
	getInitialState () {
		console.log('This #1', this);
	}
});
