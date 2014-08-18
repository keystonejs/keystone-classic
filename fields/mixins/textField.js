module.exports = {
	
	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value
		});
	}
	
}
