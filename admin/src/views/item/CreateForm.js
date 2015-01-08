var _ = require('underscore'),
	moment = require('moment'),
	React = require('react'),
	Fields = require('../../fields'),
	InvalidFieldType = require('../../components/invalidFieldType');

var Form = React.createClass({
	
	getInitialState: function() {
		return {
			// todo: implement default values
			values: {}
		};
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},
	
	render: function() {
		
		var form = {},
			headings = 0;
		
		_.each(this.props.list.uiElements, function(el) {
			
			if (el.type === 'field') {
				
				console.log(el);
				
				var field = this.props.list.fields[el.field];
				
				if ('function' !== typeof Fields[field.type]) {
					form[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
					return;
				}
				
				var fieldProps = _.clone(field);
				fieldProps.value = this.state.values[field.path] || {};
				fieldProps.values = this.state.values;
				fieldProps.onChange = this.handleChange;
				fieldProps.mode = 'create';
				form[field.path] = React.createElement(Fields[field.type], fieldProps);
				
			}
			
		}, this);
		
		return (
			<div>
				<div class="modal modal-md">
					<div class="modal-dialog">
						<form class="modal-content">
							<div class="modal-header">
								<button type="button" class="modal-close"></button>
								<div class="modal-title">Create Listing</div>
							</div>
							<div class="modal-body">
								{form}
							</div>
							<div class="modal-footer">
								<button type="submit" className="btn btn-save">Create</button>
								<button type="button" className="btn btn-link btn-cancel" onClick={this.props.onCancel}>cancel</button>
							</div>
						</form>
					</div>
				</div>
				<div class="modal-backdrop"></div>
			</div>
		);
	}
	
});

module.exports = Form;
