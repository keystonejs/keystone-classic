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

	componentWillMount: function() {
		this._bodyStyleOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},

	componentWillUnmount: function() {
		document.body.style.overflow = this._bodyStyleOverflow;
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
				<div className="modal modal-md">
					<div className="modal-dialog">
						<form className="modal-content">
							<div className="modal-header">
								<button type="button" className="modal-close" onClick={this.props.onCancel}></button>
								<div className="modal-title">Create a new {this.props.list.singular}</div>
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
