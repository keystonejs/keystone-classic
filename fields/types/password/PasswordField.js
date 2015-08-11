var React = require('react');
var Field = require('../Field');

var { Button, FormField, FormInput, FormRow, InputGroup } = require('elemental');

module.exports = Field.create({
	
	displayName: 'PasswordField',
	
	getInitialState: function() {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: ''
		};
	},
	
	valueChanged: function(which, event) {
		var newState = {};
		newState[which] = event.target.value;
		this.setState(newState);
	},
	
	showChangeUI: function() {
		this.setState({
			showChangeUI: true
		}, () => this.focus());
	},
	
	onCancel: function() {
		this.setState({
			showChangeUI: false
		}, () => this.focus());
	},
	
	renderValue: function() {
		return <FormInput noedit>{this.props.value ? 'password set' : 'password not set'}</FormInput>;
	},
	
	renderField: function() {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},
	
	renderFields: function() {
		return (
			<InputGroup>
				<InputGroup.Section grow>
					<FormInput type="password" name={this.props.path} placeholder="New password" ref="focusTarget" value={this.state.password} onChange={this.valueChanged.bind(this, 'password')} autoComplete="off" />
				</InputGroup.Section>
				<InputGroup.Section grow>
					<FormInput type="password" name={this.props.paths.confirm} placeholder="Confirm new password" value={this.state.confirm} onChange={this.valueChanged.bind(this, 'confirm')} autoComplete="off" />
				</InputGroup.Section>
				{this.state.passwordIsSet ? <InputGroup.Section><Button onClick={this.onCancel}>Cancel</Button></InputGroup.Section> : null}
			</InputGroup>
		);
	},
	
	renderChangeButton: function() {
		var label = this.state.passwordIsSet ? 'Change Password' : 'Set Password';
		return (
			<Button ref="focusTarget" onClick={this.showChangeUI}>{label}</Button>
		);
	}
	
});
