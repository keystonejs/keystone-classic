/* global Pikaday */
var _ = require('underscore'),
	React = require('react'),
	moment = require('moment');

var lastId = 0;

function newItem(value) {
	lastId++;
	return { key: 'i' + lastId, value: value, picker: null };
}

module.exports = {
	// set default properties
	getDefaultProps: function() {
		return {
			format: 'YYYY-MM-DD',
			pickers: []
		};
	},

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

	componentWillUpdate: function() {
		this.props.value.forEach(function (val, i) {
			// Destroy each of our datepickers
			if (this.props.pickers[i]) {
				this.props.pickers[i].destroy();
			}
		}, this);
	},

	componentDidUpdate: function() {
		this.props.value.forEach(function (val, i) {
			var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
			// Add a date picker to each updated field
			this.props.pickers[i] = new Pikaday({
				field: dateInput,
				format: this.props.format,
				onSelect: function(date) {//eslint-disable-line no-unused-vars
					if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
						this.props.value[i] = this.props.pickers[i].toString();
						this.props.onChange(this.props.pickers[i].toString());
					}
				}.bind(this)
			});
		}, this);
	},

	componentDidMount: function() {
		this.props.value.forEach(function (val, i) {
			var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
			if (this.props.pickers[i]) this.props.pickers[i].destroy();
			this.props.pickers[i] = new Pikaday({
				field: dateInput,
				format: this.props.format,
				onSelect: function(date) {//eslint-disable-line no-unused-vars
					if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
						this.props.value[i] = this.props.pickers[i].toString();
						this.props.onChange(this.props.pickers[i].toString());
					}
				}.bind(this)
			});
		}, this);
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

	handleBlur: function(e) {//eslint-disable-line no-unused-vars
		if (this.state.value === this.props.value) return;
		this.picker.setMoment(moment(this.state.value, this.props.format));
	},
	
	renderItem: function(i) {
		/* eslint-disable no-script-url */
		return (
			<div key={i.key} className='field-item'>
				<a href="javascript:;" className='field-item-button btn-cancel' onClick={this.removeItem.bind(this, i)}>&times;</a>
				<input ref={'input_' + i.key} className={'form-control multi datepicker_' + i.key} type='text' name={this.props.path} value={i.value} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
			</div>
		);
		/* eslint-enable */
	},
	
	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<button type="button" className='btn btn-xs btn-default' onClick={this.addItem}>Add date</button>
			</div>
		);
	}
};
