/* eslint-disable react/jsx-no-bind */

import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';

import { Fields } from 'FieldTypes';
import { Button, GlyphButton } from '../../../admin/client/App/elemental';
import InvalidFieldType from '../../../admin/client/App/shared/InvalidFieldType';

let i = 0;
function generateId () {
	return i++;
};

const ItemDom = ({ children }) => (
	<div style={{
		borderTop: '2px solid #eee',
		paddingTop: 15,
	}}>
		{children}
	</div>
);

module.exports = Field.create({
	displayName: 'ObjField',
	statics: {
		type: 'Obj',
	},
	propTypes: {
		fields: React.PropTypes.object.isRequired,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.object.isRequired
	},
	handleFieldChange (event) {
		const { value: oldValue, path, onChange } = this.props;
		// const head = oldValue.slice(0, index);
		const value = {
			...oldValue,
			[event.path]: event.value,
		};
		// const tail = oldValue.slice(index + 1);
		// const value = [...head, item, ...tail];
		onChange({ path, value });
	},
	renderFieldsForItem (value, parentPath) {
		return Object.keys(this.props.fields).map((path) => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}
			const props = assign({}, field);
			props.inputNamePrefix = parentPath;
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this);
			props.mode = 'edit';
			props.key = field.path;

			return React.createElement(Fields[field.type], props);
		}, this);
	},
	renderItems () {
		const { value = {}, path } = this.props;
		return (
				<ItemDom>
					{this.renderFieldsForItem(value, path)}
				</ItemDom>
		);
	},
	renderUI () {
		const { label } = this.props;
		return (
			<div className={css(classes.container)}>
				<h3 data-things="whatever">{label}</h3>
				{this.renderItems()}
			</div>
		);
	},
});

const classes = StyleSheet.create({
	container: {
		marginTop: '2em',
		paddingLeft: '2em',
		boxShadow: '-3px 0 0 rgba(0, 0, 0, 0.1)',
	},
});
