var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'ColorField',
	
	valueChanged: function(event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;
		console.log(newValue);
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField: function() {
		
		var colorPreview = null;
		
		if (this.props.value) {
			colorPreview = (
				<div style={{
					position: 'absolute',
					top: 5,
					right: 20,
					width: 24,
					height: 24,
					borderRadius: 5,
					borderStyle: 'solid',
					borderWidth: '1px',
					borderColor: '#E0E0E0',
					background: this.props.value
				}} />
			);
		}
		
		return (
			<div>
				<input ref='field' type='text' className='form-control' onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete='off' />
				{colorPreview}
			</div>
		);
	}
	
});
