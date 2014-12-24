var _ = require('underscore'),
	React = require('react'),
	Fields = require('../../fields'),
	FormHeading = require('../../components/formHeading'),
	Toolbar = require('../../components/toolbar'),
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
		// console.log(event);
		// console.log(values);
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
		
		var toolbar = {};
		
		if (!this.props.list.noedit) {
			toolbar['save'] = <button type="submit" className="btn btn-save">Save</button>;
			// TODO: Confirm: 'Are you sure you want to reset your changes?'
			toolbar['reset'] = <a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} className="btn btn-link btn-cancel">reset changes</a>;
		}
		
		if (!this.props.list.noedit) {
			// TODO: Confirm: 'Are you sure you want to delete this ' + list.singular.toLowerCase() + '?'
			toolbar['del'] = <a href={'/keystone/' + this.props.list.path + '?delete=' + this.props.data.id + Keystone.csrf.query} className="btn btn-link btn-cancel delete">delete {this.props.list.singular.toLowerCase()}</a>
		}
		
		return (
			<div>
				{elements}
				<Toolbar>
					{toolbar}
				</Toolbar>
			</div>
		);
	}
	
});

module.exports = {
	renderForm: function(el, list, data) {
		React.render(<Form list={list} data={data} />, el);
	}
};
