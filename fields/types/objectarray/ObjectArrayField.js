var _ = require('underscore'),
	React = require('react'),
	Field = require('../Field'),
	lastId = 0;

function newItem(defaultItemValue, parts) {
	lastId++;
	var item = {
		key: 'i' + lastId,
		obj: {},
		valueKeys: []
	};

	for(var i in parts) {
		if (parts.hasOwnProperty(i)) {
			item.obj[i] = {
				key: item.key + '_' + i,
				fieldName: i,
				label: parts[i].label,
				value: defaultItemValue[i] ? defaultItemValue[i] : ''
			};

			item.valueKeys.push(i);
		}
	}

	return item;
}

module.exports = Field.create({

	displayName: 'ObjectArrayField',

	getInitialState: function() {
		var values = this.props.value.map(function(item) {
			return newItem(item, this.props.parts);
		}.bind(this));

		return {
			values: values
		};
	},

	addItem: function() {
		var newValues = this.state.values.concat(newItem({}, this.props.parts));

		this.setState({
			values: newValues
		});

		this.valueChanged(newValues);
	},

	removeItem: function(i) {
		this.state.values.splice(i, 1);

		this.setState({
			values: this.state.values
		});

		this.valueChanged(this.state.values);
	},

	updateItem: function(obj, objIndex, parentIndex, event) {
		var updatedValues = this.state.values;

		// if we define cleanInput method then clean it first
		updatedValues[parentIndex].obj[objIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;

		this.setState({
			values: updatedValues
		});

		this.valueChanged(updatedValues);
	},

	valueChanged: function(values) {
		var objectArray = [];

		values.forEach(function(item) {
			var obj = {};

			_.forEach(item.obj, function(val, propertyKey) {
				if (typeof val !== 'function') {
					obj[propertyKey] = item.obj[propertyKey].value;
				}
			});

			objectArray.push(obj);
		});

		this.props.onChange({
			path: this.props.path,
			value: objectArray
		});
	},

	renderPart: function(obj, objIndex, parentIndex) {
		var fieldName = this.props.path + '[' + parentIndex + ']' +'[' + obj.fieldName + ']';

		return (
			<div key={obj.key}>
				<label className='label'>
					{obj.label || obj.fieldName}
				</label>
				<input ref={obj.key} className='form-control multi' type='text' name={fieldName} value={obj.value} autoComplete='off' onChange={this.updateItem.bind(this, obj, objIndex, parentIndex)} />
			</div>
		);
	},

	renderItem: function(item, itemIndex) {
		var self = this;

		return (
			<fieldset key={item.key} className='field-item'>
				<legend>
					<strong>{this.props.itemLabel} {itemIndex + 1}</strong>
					<a href="javascript:;" className="field-item-button btn-cancel" onClick={this.removeItem.bind(this, itemIndex)}>x</a>
				</legend>
				{item.valueKeys.map(function(propertyIndex) {
					return self.renderPart(item.obj[propertyIndex], propertyIndex, itemIndex);
				})}
			</fieldset>
		);
	},

	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<button type="button" className='btn btn-xs btn-default' onClick={this.addItem}>Add item</button>
			</div>
		);
	},

	// Override shouldCollapse to check for array length
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	}
});
