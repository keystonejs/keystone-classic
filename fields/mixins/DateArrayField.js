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

	componentDidUpdate: function() {
		this.state.values.forEach(function (val, i) {
			console.log(this.props.pickers)
			var dateInput = this.getDOMNode().getElementsByClassName("datepicker_"+ val.key)[0];
			// add date picker
			this.props.pickers[i] = new Pikaday({
				field: dateInput,
				format: this.props.format,
				onSelect: function(date) {
					if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
						//dateInput.value = this.props.pickers[i].toString();
						this.props.onChange(this.props.pickers[i].toString());
					}
				}.bind(this)
			});
			this.props.pickers[i].setMoment(moment(moment(), this.props.format));
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
		console.log(updatedValues)
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},
	
	valueChanged: function(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},

	handleBlur: function(e) {
		console.log(e, this)
		if (this.state.value === this.props.value) return;
		this.picker.setMoment(moment(this.state.value, this.props.format));
	},
	
	renderItem: function(i) {
		return (
			<div key={i.key} className='field-item'>
				<a href="javascript:;" className='field-item-button btn-cancel' onClick={this.removeItem.bind(this, i)}>&times;</a>
				<input ref={'input_' + i.key} className={'form-control multi datepicker_'+i.key} type='text' name={this.props.path} value={i.value} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
			</div>
		);
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
