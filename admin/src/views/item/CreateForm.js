var _ = require('underscore'),
	moment = require('moment'),
	React = require('react'),
	Fields = require('../../fields'),
	InvalidFieldType = require('../../components/invalidFieldType');

var Form = React.createClass({
	
	getInitialState: function() {
		
		var values = {};
		
		_.each(this.props.list.fields, function(field) {
			values[field.path] = field.defaultValue;
		});
		
		return {
			values: values
		};
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	componentWillMount: function() {
		this._bodyStyleOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},

	componentWillUnmount: function() {
		document.body.style.overflow = this._bodyStyleOverflow;
	},
	
	getFieldProps: function(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		return props;
	},
	
	render: function() {
		
		var form = {},
			list = this.props.list,
			formAction = '/keystone/' + list.path,
			nameField = this.props.list.nameField;
		
		if (nameField) {
			var nameFieldProps = this.getFieldProps(nameField);
			form[nameField.path] = React.createElement(Fields[nameField.type], nameFieldProps);
		}
		
		_.each(list.uiElements, function(el) {
			
			if (el.type === 'field') {
				
				var field = list.fields[el.field];
				
				if ('function' !== typeof Fields[field.type]) {
					form[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
					return;
				}
				
				var fieldProps = this.getFieldProps(field);
				
				form[field.path] = React.createElement(Fields[field.type], fieldProps);
				
			}
			
		}, this);
		
		return (
			<div>
				<div className="modal modal-md">
					<div className="modal-dialog">
						<form className="modal-content" method="post" action={formAction}>
							<input type="hidden" name="action" value="create" />
							<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
							<div className="modal-header">
								<button type="button" className="modal-close" onClick={this.props.onCancel}></button>
								<div className="modal-title">Create a new {list.singular}</div>
							</div>
							<div className="modal-body">
								{form}
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-create">Create</button>
								<button type="button" className="btn btn-link btn-cancel" onClick={this.props.onCancel}>cancel</button>
							</div>
						</form>
					</div>
				</div>
				<div className="modal-backdrop"></div>
			</div>
		);
	}
	
});

module.exports = Form;
