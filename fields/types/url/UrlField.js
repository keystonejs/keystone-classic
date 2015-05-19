var React = require('react');
var Field = require('../Field');

var Button = require('elemental').Button;
var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'URLField',

	openValue: function() {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	renderLink: function() {
		if (!this.props.value) return;
		return (
			<Button type="link" onClick={this.openValue} className="keystone-relational-button" title={'Open ' + this.props.value + ' in a new tab'}>
				<span className="octicon octicon-link" />
			</Button>
		);
	},
	wrapField: function() {
		return (
			<span>
				{this.renderField()}
				{this.renderLink()}
			</span>
		);
	},
	renderValue: function() {
		return <FormInput noedit onClick={this.openValue}>{this.props.value}</FormInput>;
	},
	
});
