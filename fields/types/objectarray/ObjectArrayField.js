import React from 'react';
import ReactDOM from 'react-dom';
import Field from '../Field';
import FieldGroup from '../../../admin/client/components/FieldGroup'
import jsonCycle from 'json-cycle';

import { Button } from 'elemental';

module.exports = Field.create({
	displayName: 'ObjectArrayField',
	getInitialState () {
		var subList = jsonCycle.retrocycle(this.props.subList);

		return {
			values: this.props.value,
			list: subList
		};
	},
	renderItems () {
		return this.state.values.map((val) => {
			return (
				<FieldGroup key={val._id} data={val} list={this.state.list} />
			);
		});
	},
	valueChanged (values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},
	addItem () {
		var newValues = this.state.values.concat(newItem());
		this.setState({
			values: newValues
		}, () => {
			if (!this.state.values.length) return;
			ReactDOM.findDOMNode(this.refs['item_' + this.state.values.length]).focus();
		});
		this.valueChanged(newValues);
	},
	renderField () {
		// var props = Object.assign(this.props.inputProps, {
		// 	autoComplete: 'off',
		// 	name: this.props.path,
		// 	onChange: this.valueChanged,
		// 	ref: 'focusTarget',
		// 	value: this.props.value
		// });

		return (
			<div>
				{ this.renderItems() }
				<Button ref="button" onClick={this.addItem}>Add item</Button>
			</div>
		);
	}
});
