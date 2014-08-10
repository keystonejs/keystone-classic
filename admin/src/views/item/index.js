/** @jsx React.DOM */

var _ = require('underscore'),
	React = require('react'),
	Fields = require('../../fields');

var Form = React.createClass({
	
	render: function() {
		
		var elements = {},
			values = this.props.data.fields;
		
		_.each(this.props.list.elements, function(el) {
			if (el.type === 'field') {
				var ops = _.clone(el.field);
				ops.value = values[el.field.path];
				elements[el.path] = (Fields[el.field.type](ops));
			}
		});
		
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
