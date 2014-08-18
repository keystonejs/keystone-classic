/** @jsx React.DOM */

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
				elements['h-' + headings] = FormHeading(el);
				
			} else if (el.type === 'field') {
				
				if ('function' !== typeof Fields[el.field.type]) {
					elements[el.field.path] = InvalidFieldType({ type: el.field.type, path: el.field.path });
					return;
				}
				
				var ops = _.clone(el.field);
				ops.value = this.state.values[el.field.path];
				ops.values = this.state.values;
				ops.onChange = this.handleChange;
				elements[el.field.path] = Fields[el.field.type](ops);
				
			}
			
		}.bind(this));
		
		return <div>
			{elements}
		</div>;
	}
	
});

module.exports = {
	renderForm: function(el, list, data) {
		React.renderComponent(<Form list={list} data={data} />, el);
	}
};
