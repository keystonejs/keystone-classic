var _ = require('underscore'),
	React = require('react'),
	Fields = require('../../fields'),
	FormHeading = require('../../components/formHeading'),
	InvalidFieldType = require('../../components/invalidFieldType');

var Form = React.createClass({
	
	getInitialState: function() {
		return {
			values: _.clone(this.props.data.fields)
		};
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		console.log(event);
		console.log(values);
		this.setState({
			values: values
		});
	},
	
	render: function() {
		
		var elements = {},
			headings = 0;
		
		_.each(this.props.list.elements, function(el) {
			
			if (el.type === 'heading') {
				
				headings++;
				elements['h-' + headings] = React.createElement(FormHeading, el);
				
			} else if (el.type === 'field') {
				
				if ('function' !== typeof Fields[el.field.type]) {
					elements[el.field.path] = React.createElement(InvalidFieldType, { type: el.field.type, path: el.field.path });
					return;
				}
				
				var fieldProps = _.clone(el.field);
				fieldProps.value = this.state.values[el.field.path];
				fieldProps.values = this.state.values;
				fieldProps.onChange = this.handleChange;
				fieldProps.mode = 'edit';
				elements[el.field.path] = React.createElement(Fields[el.field.type], fieldProps);
				
			}
			
		}.bind(this));
		
		return (
			<div>{elements}</div>
		);
	}
	
});

module.exports = {
	renderForm: function(el, list, data) {
		React.render(<Form list={list} data={data} />, el);
	}
};
