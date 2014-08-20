/** @jsx React.DOM */

var React = require('react');

var Option = React.createClass({
	
	select: function() {
		this.props.onSelect({
			value: this.props.value,
			label: this.props.label
		});
	},
	
	render: function() {
		return <div className="react-select-input" onClick={this.select}>{this.props.label}</div>;
	}
	
});

var Select = React.createClass({
	
	getInitialState: function() {
		return {
			value: this.props.value,
			inputText: '',
			isOpen: false
		};
	},
	
	open: function() {
		this.setState({
			isOpen: true,
			inputText: ''
		});
	},
	
	close: function() {
		this.setState({
			isOpen: false
		});
	},
	
	blur: function(event) {
		// wait for the event to fire on an option
		setTimeout(function() {
			this.close()
		}.bind(this), 100);
	},
	
	updateInputText: function(event) {
		this.setState({
			inputText: event.target.value
		});
	},
	
	selectOption: function(option) {
		this.setState({
			value: option.value,
			inputText: option.label
		});
		console.log(this.state);
		this.close();
	},
	
	getOptions: function() {
		
		var ops = {};
		
		_.each(this.props.options, function(op) {
			if (!this.state.inputText
				|| op.value.toLowerCase().indexOf(this.state.inputText.toLowerCase()) >= 0
				|| op.label.toLowerCase().indexOf(this.state.inputText.toLowerCase()) >= 0
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
		
		var menu = this.state.isOpen ? <div className="react-select-menu">{this.getOptions()}</div> : null;
		
		return <div className="react-select">
			<input className="react-select-input" ref="input" value={this.state.inputText} onFocus={this.open} onBlur={this.blur} onChange={this.updateInputText} />
			{menu}
		</div>;
	}
	
});

module.exports = Select;
