var classnames = require('classnames');
var React = require('react');
var Transition = React.addons.CSSTransitionGroup;
var { Button, Checkbox, InputGroup, SegmentedControl } = require('elemental');

const ESC_KEYCODE = 27;

var Popout = React.createClass({
	displayName: 'Popout',
	propTypes: {
		isOpen: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
	},
	
	getDefaultProps () {
		return {
			isOpen: false,
		};
	},
	
	getInitialState () {
		return {
			isOpen: false,
			selectedColumns: {},
		};
	},
	
	componentDidMount: function() {
		window.addEventListener('keydown', this.handleKeyDown);
	},
	
	componentWillUnMount: function() {
		window.removeEventListener('keydown', this.handleKeyDown);
	},
	
	handleKeyDown (e) {
		if ( e.keyCode == ESC_KEYCODE ) {
			this.props.onCancel();
		}
	},

	renderPopout () {
		if (!this.props.isOpen) return;
		
		return (
			<div className="Popout">
				<span className="Popout__arrow" />
				<div className="Popout__inner">
					{this.props.children}
				</div>
			</div>
		);
	},

	renderBlockout () {
		if (!this.props.isOpen) return;
		return <div className="blockout" onClick={this.props.onCancel} />;
	},
	
	render () {
		return (
			<span>
				<Transition className="Popout-wrapper" transitionName="Popout" component="div">
					{this.renderPopout()}
				</Transition>
				{this.renderBlockout()}
			</span>
		);
	}
	
});

module.exports = Popout;

// expose the child to the top level export
module.exports.Header = require('./PopoutHeader');
module.exports.Body = require('./PopoutBody');
module.exports.Footer = require('./PopoutFooter');
