var _ = require('underscore'),
	React = require('react');

var lastId = 0;

function newItem(value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

module.exports = {
	getInitialState: function() {
		return {
			values: this.props.value.map(newItem)
		};
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.value.join('|') !== _.pluck(this.state.values, 'value').join('|')) {
			this.setState({
				values: nextProps.value.map(newItem)
			});
		}
	},
	
	addItem: function() {
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},
	
	removeItem: function(i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},
	
	updateItem: function(i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		this.setState({
			values: updatedValues
		});
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},
	
	valueChanged: function(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},
	
	renderItem: function(i) {
		/* eslint-disable no-script-url */
		return (
			<div key={i.key} className='field-item'>
				<a href="javascript:;" className='field-item-button btn-cancel' onClick={this.removeItem.bind(this, i)}>&times;</a>
				<input ref={'input_' + i.key} className='form-control multi' type='text' name={this.props.path} value={i.value} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
			</div>
		);
		/* eslint-enable */
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
};
