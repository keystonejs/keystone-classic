var _ = require('underscore'),
	Field = require('../field'),
	React = require('react');

var lastId = 0;

function newItem(value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

module.exports = Field.create({
	getInitialState: function() {
		return {
			values: this.props.value.map(newItem)
		};
	},
	
	addItem: function() {
		this.setState({
			values: this.state.values.concat(newItem(''))
		});
	},
	
	removeItem: function(i) {
		this.setState({
			values: _.without(this.state.values, i)
		});
	},
	
	updateItem: function(i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = event.target.value;
		this.setState({
			values: updatedValues
		});
	},
	
	renderItem: function(i) {
		return (
			<div key={i.key} className='field-item'>
				<input className='form-control multi' type='text' name={this.props.path} value={i.value} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
				<a className='btn btn-link btn-cancel' onClick={this.removeItem.bind(this, i)}>
					<span className='ion-close-round' />
				</a>
			</div>
		);
	},
	
	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<a className='btn btn-xs btn-default' onClick={this.addItem}>Add item</a>
			</div>
		);
	}
});
