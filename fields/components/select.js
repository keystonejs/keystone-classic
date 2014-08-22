/** @jsx React.DOM */

var React = require('react');

var noop = function() {};

var Option = React.createClass({
	
	select: function() {
		this.props.onSelect({
			value: this.props.value,
			label: this.props.label
		});
	},
	
	handleFocus: function() {
		console.log(event.target.getDOMNode());
	},
	
	render: function() {
		return <div className="Select-option" onMouseDown={this.select} onFocus={this.handleFocus}>{this.props.label}</div>;
	}
	
});

var Select = React.createClass({
		
	getInitialState: function() {
		return {
			value: this.props.value,
			inputValue: '',
			matchedOption: null,
			isFocused: false,
			isOpen: false
		};
	},
	
	componentWillMount: function() {
		this.updateFromValue();
	},
	
	updateFromValue: function() {
		
		var selectedOption = _.findWhere(this.props.options, { value: this.state.value });
		
		this.setState(selectedOption ? {
			value: selectedOption.value,
			inputValue: selectedOption.label
		} : {
			value: '',
			inputValue: ''
		});
		
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		// if (prevState.isFocused && !this.state.isFocused && this.state.isOpen) {
		// 	this.close();
		// }
	},
	
	handleInputChange: function(event) {
		this.setState({
			isOpen: true,
			inputValue: event.target.value
		});
	},
	
	handleClick: function() {
		if (!this.state.isFocused) {
			this.refs.input.getDOMNode().focus();
		}
	},
	
	handleFocus: function() {
		this.setState({
			isOpen: true,
			isFocused: true,
			inputValue: ''
		});
	},
	
	handleBlur: function(event) {
		this.setState({
			isFocused: false,
			isOpen: false,
		});
		this.updateFromValue();
	},
	
	selectOption: function(option) {
		this.setState({
			value: option.value,
			inputValue: option.label,
			isOpen: false
		});
	},
	
	close: function() {
		this.setState({
			isOpen: false
		});
	},
	
	clear: function() {
		this.setState({
			value: '',
			inputValue: '',
			isOpen: false
		});
	},
	
	getOptions: function() {
		
		var ops = {};
		
		_.each(this.props.options, function(op) {
			if (!this.state.inputValue
				|| op.value.toLowerCase().indexOf(this.state.inputValue.toLowerCase()) >= 0
				|| op.label.toLowerCase().indexOf(this.state.inputValue.toLowerCase()) >= 0
			) {
				ops[op.value] = Option({
					label: op.label,
					value: op.value,
					onSelect: this.selectOption
				});
			}
		}, this);
		
		return ops;
		
	},
	
	render: function() {
		
		console.log(this.state);
		
		var menu = this.state.isOpen ? <div className="Select-menu">{this.getOptions()}</div> : null;
		var clear = this.state.value ? <span className="Select-clear" onClick={this.clear}>&times;</span> : null;
		var selectState = this.state.isOpen ? 'Select is-open' : 'Select';
		
		return <div className={selectState}>
			<input type="hidden" ref="value" name={this.props.name} value={this.state.value} />
			<div className="Select-control" onClick={this.handleClick}>
				<input className="Select-input" placeholder="Select..." ref="input" value={this.state.inputValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleInputChange} />
				{clear}
			</div>
			{menu}
		</div>;
	}
	
});

module.exports = Select;
