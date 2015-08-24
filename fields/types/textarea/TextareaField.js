import Field from '../Field';
import React from 'react';

module.exports = Field.create({

	displayName: 'TextareaField',

	renderField () {
		var styles = {
			height: this.props.height
		};
		return <textarea name={this.props.path} styles={styles} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="FormInput" />;
	}

});
