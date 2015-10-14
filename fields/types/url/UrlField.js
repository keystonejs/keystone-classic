import React from 'react';
import Field from '../Field';
import { Button, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'URLField',

	openValue () {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	renderLink () {
		if (!this.props.value) return null;

		return (
			<Button type="link" onClick={this.openValue} className="keystone-relational-button" title={'Open ' + this.props.value + ' in a new tab'}>
				<span className="octicon octicon-link" />
			</Button>
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
	}

});
