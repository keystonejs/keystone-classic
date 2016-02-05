import React from 'react';
import ReactDOM from 'react-dom';
import Field from '../Field';
import FieldGroup from '../../../admin/client/components/FieldGroup'
import jsonCycle from 'json-cycle';

import { Button } from 'elemental';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
var lastId = 0;

=======
>>>>>>> UI almost done.
=======
var lastId = 0;

>>>>>>> Need to go home again. Zzzzz.
=======
var lastId = 0;

>>>>>>> d88430accc518f7ff5bd0a61d76e4428abd26f58
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
				<FieldGroup key={val._id} parentPath={this.props.path} data={val} list={this.state.list} onRemove={ this.removeItem } />
=======
				<FieldGroup key={val._id} data={val} list={this.state.list} />
>>>>>>> UI almost done.
=======
				<FieldGroup key={val._id} parentPath={this.props.path} data={val} list={this.state.list} />
>>>>>>> Need to go home again. Zzzzz.
=======
				<FieldGroup key={val._id} parentPath={this.props.path} data={val} list={this.state.list} onRemove={ this.removeItem } />
>>>>>>> Implemented removing of object array item
=======
				<FieldGroup key={val._id} parentPath={this.props.path} data={val} list={this.state.list} />
>>>>>>> d88430accc518f7ff5bd0a61d76e4428abd26f58
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Need to go home again. Zzzzz.
=======
>>>>>>> d88430accc518f7ff5bd0a61d76e4428abd26f58
		var newItem = {};

		lastId += 1;

		Object.keys(this.state.list.fields).forEach((key, i) => {
			var field = this.state.list.fields[key];

			newItem[key] = field.type.indexOf('array') == -1 ? '' : [];
			newItem._id = lastId;
		});

		var newValues = this.state.values.concat([newItem]);
<<<<<<< HEAD
<<<<<<< HEAD
		this.setState({
			values: newValues
		});
		this.valueChanged(newValues);
	},
	removeItem: function(item) {

		var newValues = this.state.values.filter((value) => {
			return value._id != item._id;
		});
		this.setState({
			values: newValues
=======
		var newValues = this.state.values.concat(newItem());
		this.setState({
			values: newValues
		}, () => {
			if (!this.state.values.length) return;
			ReactDOM.findDOMNode(this.refs['item_' + this.state.values.length]).focus();
>>>>>>> UI almost done.
=======
		this.setState({
			values: newValues
>>>>>>> Need to go home again. Zzzzz.
		});
		this.valueChanged(newValues);
	},
	removeItem: function(item) {

		var newValues = this.state.values.filter((value) => {
			return value._id != item._id;
		});
=======
>>>>>>> d88430accc518f7ff5bd0a61d76e4428abd26f58
		this.setState({
			values: newValues
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
				<Button ref="addObjectItemButton" onClick={this.addItem}>Add item</Button>
=======
				<Button ref="button" onClick={this.addItem}>Add item</Button>
>>>>>>> UI almost done.
=======
				<Button ref="addObjectItemButton" onClick={this.addItem}>Add item</Button>
>>>>>>> Implemented removing of object array item
=======
				<Button ref="button" onClick={this.addItem}>Add item</Button>
>>>>>>> d88430accc518f7ff5bd0a61d76e4428abd26f58
			</div>
		);
	}
});
