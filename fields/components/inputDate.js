var React = require('react'),
	pikaday = require('pikaday');

module.exports = React.createClass({

	// set default properties
	getDefaultProps: function() {
		format: 'YYYY-MM-DD'
	},

	componentDidMount: function() {
		// add date picker
		this.picker = new Pikaday({ 
			field: this.getDOMNode(),
			format: this.props.format,
			onSelect: function(date) {
				// trigger onChange if set
				this.props.onChange && this.props.onChange(this.picker.toString());
			}.bind(this)
		});			
	},

	componentWillUnmount: function() {
		// clean up
		this.picker.destroy();
	},

	shouldComponentUpdate: function(nextProps) {
		// don't update if nothing has changed
		return nextProps.value !== this.props.value;
	},
	
	valueChanged: function(e) {
		// update picker with the new value
		this.picker.setDate(e.target.value);
	},

	render: function() {
		return <input type="text" name={this.props.name} value={this.props.value} placeholder={this.props.format} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
