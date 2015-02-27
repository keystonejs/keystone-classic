var React = require('react'),
	Pikaday = require('pikaday'),
	moment = require('moment');

module.exports = React.createClass({
	
	displayName: 'DateInput',
	
	// set default properties
	getDefaultProps: function() {
		return {
			format: 'YYYY-MM-DD'
		};
	},
	
	getInitialState: function() {
		return {
			value: this.props.value,
			id: Math.round(Math.random()*100000)
		};
	},
	
	componentWillReceiveProps: function(newProps) {
		console.log('DateInput [' + this.state.id + '] received props. value ("' + newProps.value + '" === "' + this.state.value + '") -- ' + (newProps.value === this.state.value ? 'no change' : 'updating state'));
		if (newProps.value === this.state.value) return;
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
				console.log('DatePicker [' + this.state.id + '] selected. value ("' + this.picker.toString() + '" === "' + this.props.value + '") -- ' + (this.picker.toString() === this.props.value ? 'no change' : 'firing onChange event'));
				if (this.props.onChange && this.picker.toString() !== this.props.value) {
					console.log('DatePicker [' + this.state.id + '] updated date: ' + date + ', firing onChange("' + this.picker.toString() + '")');
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
		console.log('DateInput [' + this.state.id + '] changed. value ("' + e.target.value + '" === "' + this.state.value + '") -- ' + (e.target.value === this.state.value ? 'no change' : 'updating state'));
		if (e.target.value === this.state.value) return;
		this.setState({ value: e.target.value });
	},
	
	handleBlur: function(e) {
		console.log('DateInput [' + this.state.id + '] blurred. value ("' + this.state.value + '" === "' + this.props.value + '") -- ' + (this.state.value === this.props.value ? 'no change' : 'updating datePicker'));
		if (this.state.value === this.props.value) return;
		this.picker.setDate(this.state.value);
	},

	render: function() {
		return <input type="text" name={this.props.name} value={this.state.value} placeholder={this.props.format} onChange={this.handleChange} onBlur={this.handleBlur} autoComplete="off" className="form-control" />;
	}
	
});
