var React = require('react');
var _ = require('underscore');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

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

	renderItem: function(item, index) {
		return (
			<FormField key={item.key}>
				<FormInput ref={'item_' + (index + 1)} name={this.props.path} value={item.value} onChange={this.updateItem.bind(this, item)} autoComplete="off" />
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
				<Button ref="button" onClick={this.addItem}>Add item</Button>
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
	},

	// Override shouldCollapse to check for array length
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	}
};
