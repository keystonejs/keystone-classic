var React = require('react'),
	Pikaday = require('pikaday'),
	moment = require('moment');

module.exports = React.createClass({

	// set default properties
	getDefaultProps: function() {
		format: 'YYYY-MM-DD'
	},
	
	getInitialState: function() {
		return {
			value: this.props.value
		};
	},
	
	componentWillReceiveProps: function(newProps) {
		this.setState({
			value: newProps.value
		});
		this.picker.setDate(newProps.value);
	},

	componentDidMount: function() {
		// add date picker
		this.picker = new Pikaday({ 
			field: this.getDOMNode(),
			format: this.props.format,
			onSelect: function(date) {
				if (this.props.onChange && this.picker.toString() !== this.props.value) {
					this.props.onChange(this.picker.toString());
				}
			}.bind(this)
		});			
	},

	componentWillUnmount: function() {
		// clean up
		this.picker.destroy();
	},
	
	handleChange: function(e) {
		this.setState({ value: e.target.value });
	},
	
	handleBlur: function(e) {
		if (this.state.value !== this.props.value) {
			this.picker.setDate(this.state.value);
		}
	},

	render: function() {
		return <input type="text" name={this.props.name} value={this.state.value} placeholder={this.props.format} onChange={this.handleChange} onBlur={this.handleBlur} autoComplete="off" className="form-control" />;
	}
	
});
