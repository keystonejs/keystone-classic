import React from 'react';
import Field from '../Field';
import Checkbox from '../../../admin/src/components/Checkbox';
import { FormField, FormNote } from 'elemental';

module.exports = Field.create({

	displayName: 'BooleanField',

	propTypes: {
		indent: React.PropTypes.bool,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.bool,
	},

	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		return (
			<FormField offsetAbsentLabel={this.props.indent} className="field-type-boolean">
				<label style={{ height: '2.3em' }}>
					<Checkbox readonly={!this.shouldRenderField()} name={this.props.path} checked={this.props.value} onChange={this.valueChanged} />
					<span style={{ marginLeft: '.75em' }}>{this.props.label}</span>
				</label>
				{this.renderNote()}
			</FormField>
		);
	}

});
