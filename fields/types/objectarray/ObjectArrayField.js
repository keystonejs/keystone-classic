import Field from '../Field';

module.exports = Field.create({
	displayName: 'ObjectArrayField',
	getInitialState () {
		console.log(this.props);

		return({
			hurrdurr: 'test'
		});
	}
});
