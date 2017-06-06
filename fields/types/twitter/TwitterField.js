import React from 'react';
import Field from '../Field';
import { Button, FormInput } from 'elemental';

module.exports = Field.create({
	displayName: 'TwitterField',
	statics: {
		type: 'Twitter',
	},
	openValue () {
		var href = this.props.value;
		if (!href) return;
		// if href is a valid twitter username, format it
		if (/^@?(\w){1,15}$/.test(href)) {
			href = 'http://twitter.com/' + href;
		}
		window.open(href);
	},
	renderLink () {
		var value = this.props.value;
		if (!value) return null;
		return (
			<Button type="link" onClick={this.openValue} className="keystone-relational-button" title={'Open ' + this.props.value + ' in a new tab'}>
				<span className="octicon octicon-link" />
			</Button>
		);
	},
	renderField () {
		return (
			<FormInput
				name={this.props.path}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
				type="text"
			/>
		);
	},
	wrapField () {
		return (
			<div style={{ position: 'relative' }}>
				{this.renderField()}
				{this.renderLink()}
			</div>
		);
	},
	renderValue () {
		return <FormInput noedit onClick={this.openValue}>{this.props.value}</FormInput>;
	},
});
