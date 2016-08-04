/* eslint-disable react/jsx-no-bind */

import assign from 'object-assign';
import React from 'react';
import Field from '../Field';
import Domify from 'react-domify';

import { Fields } from 'FieldTypes';
import { Button, GlyphButton } from '../../../admin/client/App/elemental';
import InvalidFieldType from '../../../admin/client/App/shared/InvalidFieldType';

function generateId () {
	return Math.random().toString(36).substr(2, 9);
};

module.exports = Field.create({
	displayName: 'ListField',
	statics: {
		type: 'List',
	},
	propTypes: {
		fields: React.PropTypes.object.isRequired,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.array,
	},
	addItem () {
		const value = this.props.value.slice();
		value.push({
			_id: generateId(),
			_isNew: true,
		});
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	removeItem (index) {
		const oldValue = this.props.value;
		const value = oldValue.slice(0, index).concat(oldValue.slice(index + 1));
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	handleFieldChange (index, event) {
		const value = this.props.value.slice();
		const update = value[index];
		update[event.path] = event.value;
		value.splice(index, 1, update);
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	renderFieldsForItem (index, value) {
		return Object.keys(this.props.fields).map((path) => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}
			const props = assign({}, field);
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this, index);
			props.mode = 'edit';
			props.inputNamePrefix = `${this.props.path}[${index}]`;
			props.key = field.path;
			// TODO ?
			// if (props.dependsOn) {
			// 	props.currentDependencies = {};
			// 	Object.keys(props.dependsOn).forEach(dep => {
			// 		props.currentDependencies[dep] = this.state.values[dep];
			// 	});
			// }
			return React.createElement(Fields[field.type], props);
		}, this);
	},
	renderItems () {
		return (
			<div>
				{this.props.value.map((value, index) => (
					<div key={`item${value._id}`} style={{
						borderTop: '2px solid #eee',
						paddingTop: 15,
					}}>
						{!value._isNew ? (
							<input type="hidden" name={`${this.props.path}[${index}][id]`} value={value._id} />
						) : null}
						{this.renderFieldsForItem(index, value)}
						<div style={{ textAlign: 'right', paddingBottom: 10 }}>
							<Button size="xsmall" color="danger" onClick={e => this.removeItem(index)}>
								remove
							</Button>
						</div>
					</div>
				))}
				<GlyphButton color="success" glyph="plus" position="left" onClick={this.addItem}>
					Add
				</GlyphButton>
			</div>
		);
	},
	renderUI () {
		const { label, value } = this.props;
		return (
			<div>
				<h3 data-things="whatever">{label}</h3>
				{this.shouldRenderField() ? (
					this.renderItems()
				) : (
					<Domify value={value} />
				)}
				{this.renderNote()}
			</div>
		);
	},
});
