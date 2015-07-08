var React = require('react'),
	// ColorPicker = require('colorPicker'),
	moment = require('moment');
// var $ = require('jquery');

module.exports = React.createClass({
	
	displayName: 'ColorInput',
	
	// set default properties
	getDefaultProps: function() {
		return {
			placeHolder: '#xxxxxx',
			format: 'hex'
		};
	},
	
	getInitialState: function() {
		return {
			value: this.props.value,
			id: Math.round(Math.random() * 100000)
		};
	},
	
	componentWillReceiveProps: function(newProps) {
		if (newProps.value === this.state.value) return;
		this.setState({
			value: newProps.value
		});
	},

	componentDidMount: function() {
		// add date picker
		/*this.picker = new Pikaday({ 
			field: this.getDOMNode(),
			format: this.props.format,
			yearRange: this.props.yearRange,
			onSelect: function(date) {//eslint-disable-line no-unused-vars
				if (this.props.onChange && this.picker.toString() !== this.props.value) {
					this.props.onChange(this.picker.toString());
				}
			}.bind(this)
		});*/
		this.picker = $(this.el()).colorpicker({
			color: this.state.value,
			format: this.props.format
		});
		this.picker.on('changeColor', this.onChangeColor);
	},

	componentWillUnmount: function() {
		// clean up
		// this.picker.destroy();
	},
	
	el: function () {
		if (this.isMounted()) {
			return this.getDOMNode();
		}
	},

	onChangeColor: function (event) {
		var value = event.color.toHex();
		if (value === this.state.value) return;
		this.setState({ value: value });
		this.props.onChange({
			value: value
		});
	},

	handleChange: function(e) {
		if (e.target.value === this.state.value) return;
		this.setState({ value: e.target.value });
		this.props.onChange({
			value: e.target.value
		});
	},
	
	render: function() {
		return <input type="text" name={this.props.name} value={this.state.value} placeholder={this.props.placeHolder} onChange={this.handleChange} autoComplete="off" className="form-control color-picker" />;
	}
	
});
