import React from 'react';
import Portal from './Portal';
import Transition from 'react-addons-css-transition-group';

const sizes = {
	arrowHeight: 12
};

var Popout = React.createClass({
	displayName: 'Popout',
	propTypes: {
		isOpen: React.PropTypes.bool,
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
		relativeToID: React.PropTypes.string.isRequired,
		width: React.PropTypes.number,
	},

	getInitialState () {
		return {};
	},

	getDefaultProps () {
		return {
			width: 320,
		};
	},

	getPortalDOMNode () {
		return this.refs.portal.getPortalDOMNode();
	},

	componentDidMount () {
		if (this.props.isOpen) this.calculatePosition();
	},

	componentWillReceiveProps (nextProps) {
		if (!this.props.isOpen && nextProps.isOpen) this.calculatePosition();
	},

	calculatePosition () {
		let posNode = document.getElementById(this.props.relativeToID);

		let pos = {
			top: 0,
			left: 0,
			width: posNode.offsetWidth,
			height: posNode.offsetHeight
		};
		while (posNode.offsetParent) {
			pos.top += posNode.offsetTop;
			pos.left += posNode.offsetLeft;
			posNode = posNode.offsetParent;
		}

		let leftOffset = pos.left + (pos.width / 2) - (this.props.width / 2);
		let topOffset = pos.top + pos.height + sizes.arrowHeight;

		this.setState({
			leftOffset: leftOffset,
			topOffset: topOffset
		});
	},

	renderPopout () {
		if (!this.props.isOpen) return;

		return (
			<div className="Popout" style={{ left: this.state.leftOffset, top: this.state.topOffset, width: this.props.width }}>
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
			<Portal className="Popout-wrapper" ref="portal">
				<Transition className="Popout-animation" transitionEnterTimeout={200} transitionLeaveTimeout={200} transitionName="Popout" component="div">
					{this.renderPopout()}
				</Transition>
				{this.renderBlockout()}
			</Portal>
		);
	}

});

module.exports = Popout;

// expose the child to the top level export
module.exports.Header = require('./PopoutHeader');
module.exports.Body = require('./PopoutBody');
module.exports.Footer = require('./PopoutFooter');
module.exports.Pane = require('./PopoutPane');
