var moment = require('moment');
var Pikaday = require('pikaday');
var React = require('react');

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
			id: Math.round(Math.random() * 100000)
		};
	},

	componentWillReceiveProps: function(newProps) {
		if (newProps.value === this.state.value) return;
		this.setState({
			value: newProps.value
		});
		this.picker.setMoment(moment(newProps.value, this.props.format));
	},

	componentDidMount: function() {
		this.picker = new Pikaday({
			field: this.getDOMNode(),
			format: this.props.format,
			yearRange: this.props.yearRange,
			onSelect: (date) => { // eslint-disable-line no-unused-vars
				if (this.props.onChange && this.picker.toString() !== this.props.value) {
					this.props.onChange(this.picker.toString());
				}
			}
		});
	},

	componentWillUnmount: function() {
		this.picker.destroy();
	},

	handleChange: function(e) {
		if (e.target.value === this.state.value) return;
		this.setState({ value: e.target.value });
	},

	handleBlur: function(e) { // eslint-disable-line no-unused-vars
		if (this.state.value === this.props.value) return;
		var newValue = moment(this.state.value, this.props.format);
		if (newValue.isValid()) {
			this.picker.setMoment(newValue);
		} else {
			this.picker.setDate(null);
			if (this.props.onChange) this.props.onChange('');
		}
	},

	render: function() {
		return <input type="text" name={this.props.name} value={this.state.value} placeholder={this.props.placeholder} onChange={this.handleChange} onBlur={this.handleBlur} autoComplete="off" className="form-control" />;
	}

});
