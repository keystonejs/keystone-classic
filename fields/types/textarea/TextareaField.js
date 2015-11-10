var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'TextareaField',
	
	renderField: function() {
		var styles = {
			height: this.props.height
		};
		return <textarea name={this.props.path} styles={styles} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
