import React from 'react';
import blacklist from 'blacklist';
import assign from 'object-assign';

var FooterBar = React.createClass({
	propTypes: {
		style: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			style: {},
		};
	},
	getInitialState () {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0,
		};
	},
	componentDidMount () {
		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;
		var footer = this.refs.footer;
		this.windowSize = this.getWindowSize();
		var footerStyle = window.getComputedStyle(footer);
		this.footerSize = {
			x: footer.offsetWidth,
			y: footer.offsetHeight + parseInt(footerStyle.marginTop || '0'),
		};
		window.addEventListener('scroll', this.recalcPosition, false);
		window.addEventListener('resize', this.recalcPosition, false);
		this.recalcPosition();
	},
	componentWillUnmount () {
		window.removeEventListener('scroll', this.recalcPosition, false);
		window.removeEventListener('resize', this.recalcPosition, false);
	},
	getWindowSize () {
		return {
			x: window.innerWidth,
			y: window.innerHeight,
		};
	},
	recalcPosition () {
		var wrapper = this.refs.wrapper;

		this.footerSize.x = wrapper.offsetWidth;

		var offsetTop = 0;
		var offsetEl = wrapper;

		while (offsetEl) {
			offsetTop += offsetEl.offsetTop;
			offsetEl = offsetEl.offsetParent;
		}

		var maxY = offsetTop + this.footerSize.y;
		var viewY = window.scrollY + window.innerHeight;

		var newSize = this.getWindowSize();
		var sizeChanged = (newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y);
		this.windowSize = newSize;

		var newState = {
			width: this.footerSize.x,
			height: this.footerSize.y,
		};

		if (viewY > maxY && (sizeChanged || this.mode !== 'inline')) {
			this.mode = 'inline';
			newState.top = 0;
			newState.position = 'absolute';
			this.setState(newState);
		} else if (viewY <= maxY && (sizeChanged || this.mode !== 'fixed')) {
			this.mode = 'fixed';
			newState.top = window.innerHeight - this.footerSize.y;
			newState.position = 'fixed';
			this.setState(newState);
		}
	},
	render () {
		var wrapperStyle = {
			height: this.state.height,
			marginTop: 60,
			position: 'relative',
		};
		var footerProps = blacklist(this.props, 'children', 'style');
		var footerStyle = assign({}, this.props.style, {
			position: this.state.position,
			top: this.state.top,
			width: this.state.width,
			height: this.state.height,
		});
		return (
			<div ref="wrapper" style={wrapperStyle}>
				<div ref="footer" style={footerStyle} {...footerProps}>{this.props.children}</div>
			</div>
		);
	},
});

module.exports = FooterBar;
