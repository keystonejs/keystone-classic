var React = require('react'),
	Field = require('../field'),
	Note = require('../../components/note');

module.exports = Field.create({

	supports: {
		focusTarget: 'password'
	},
	
	valueChanged: function(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},
	
	renderValue: function() {
		return <div className="field-value">{this.props.value ? "password set" : "password not set"}</div>;
	},
	
	renderField: function() {
		return (
			<div className="form-row">
				<div className="col-sm-6">
					<input type="password" name={this.props.path} placeholder='New password' ref="password" value={this.props.value.first} onChange={this.valueChanged.bind(this, 'password')} autoComplete="off" className="form-control" />
				</div>
				<div className="col-sm-6">
					<input type="password" name={this.props.paths.confirm} placeholder='Confirm new password' ref="confirm" value={this.props.value.last} onChange={this.valueChanged.bind(this, 'confirm')} autoComplete="off" className="form-control" />
				</div>
			</div>
		);
	}
	
});
