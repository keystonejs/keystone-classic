/* global Pikaday */
var React = require('react');
var _ = require('underscore');
var moment = require('moment');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

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
		var self = this;
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues
		}, function() {
			if (!self.state.values.length) return;
			self.refs['item_' + self.state.values.length].getDOMNode().focus();
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},

	removeItem: function(i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues
		}, function() {
			this.refs.button.getDOMNode().focus();
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

	renderItem: function(item, index) {
		return (
			<FormField key={item.key}>
				<FormInput ref={'item_' + (index + 1)} className={'multi datepicker_' + item.key} name={this.props.path} value={item.value} onChange={this.updateItem.bind(this, item)} placeholder={this.props.format} autoComplete="off" />
				<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
					<span className="octicon octicon-x" />
				</Button>
			</FormField>
		);
	},

	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<Button ref="button" onClick={this.addItem}>Add date</Button>
			</div>
		);
	},

	renderValue: function () {
		return (
			<div>
				{this.state.values.map((item, i) => {
					return (
						<div key={i} style={i ? { marginTop: '1em' } : null}>
							<FormInput noedit value={item.value} />
						</div>
					);
				})}
			</div>
		);
	}
};
