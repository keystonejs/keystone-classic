var React = require('react');
var classNames = require('classnames');

var filters = require('../filters');

var { Button } = require('elemental');

var ListFiltersAddForm = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func
	},

	getInitialState () {
		return {
			value: {}
		};
	},
	
	updateValue (value) {
		this.setState({
			value: Object.assign(this.state.value, value)
		});
	},

	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply(this.state.value);
	},

	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI.</div>
		);
	},

	render () {
		var TypeFilter = filters[this.props.field.type];
		
		return (
			<div className="popout__body">
				{TypeFilter ? <TypeFilter field={this.props.field} value={this.state.value} onChange={this.updateValue} /> : this.renderInvalidFilter()}
			</div>
		);
	}

});

module.exports = ListFiltersAddForm;
