var _ = require('underscore');
var React = require('react');
var Field = require('../Field');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormRow = require('elemental').FormRow;

module.exports = Field.create({
	
	displayName: 'PasswordField',

	focusTarget: 'password',
	
	getInitialState: function() {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: ''
		};
	},
	
	componentDidUpdate: function() {
		if (this._focusAfterUpdate) {
			this._focusAfterUpdate = false;
			this.focus();
		}
	},
	
	valueChanged: function(which, event) {
		this.setState(_.object([which], [event.target.value]));
		if (which === 'password') {
			this.props.onChange({
				path: this.props.path,
				value: event.target.value
			});
		}
	},
	
	showChangeUI: function() {
		this._focusAfterUpdate = true;
		this.setState({
			showChangeUI: true
		});
	},
	
	renderValue: function() {
		return <FormInput noedit>{this.props.value ? 'password set' : 'password not set'}</FormInput>;
	},
	
	renderField: function() {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},
	
	renderFields: function() {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput type="password" name={this.props.path} placeholder="New password" ref="password" value={this.state.password} onChange={this.valueChanged.bind(this, 'password')} autoComplete="off" />
				</FormField>
				<FormField width="one-half">
					<FormInput type="password" name={this.props.paths.confirm} placeholder="Confirm new password" ref="confirm" value={this.state.confirm} onChange={this.valueChanged.bind(this, 'confirm')} autoComplete="off" />
				</FormField>
			</FormRow>
		);
	},
	
	renderChangeButton: function() {
		var label = this.state.passwordIsSet ? 'Change Password' : 'Set Password';
		return (
			<Button onClick={this.showChangeUI}>{label}</Button>
		);
	}
	
});
