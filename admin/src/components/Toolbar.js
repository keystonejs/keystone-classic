var _ = require('underscore'),
	React = require('react'),
	blacklist = require('blacklist');

var Toolbar = React.createClass({
	
	displayName: 'Toolbar',
	
	getInitialState: function() {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0
		};
	},
	
	componentDidMount: function() {
		
		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;
		
		var toolbar = this.refs.toolbar.getDOMNode();
		
		this.windowSize = this.getWindowSize();
		
		var toolbarStyle = window.getComputedStyle(toolbar);
		
		this.toolbarSize = {
			x: toolbar.offsetWidth,
			y: toolbar.offsetHeight + parseInt(toolbarStyle.marginTop || '0')
		};
		
		window.addEventListener('scroll', this.recalcPosition, false);
		window.addEventListener('resize', this.recalcPosition, false);
		
		this.recalcPosition();
	},
	
	getWindowSize: function() {
		return {
			x: window.innerWidth,
			y: window.innerHeight	
		};
	},
	
	recalcPosition: function() {
		var wrapper = this.refs.wrapper.getDOMNode();
		
		this.toolbarSize.x = wrapper.offsetWidth;
		
		var offsetTop = 0;
		var offsetEl = wrapper;
		
		while (offsetEl) {
			offsetTop += offsetEl.offsetTop;
			offsetEl = offsetEl.offsetParent;
		}
		
		var maxY = offsetTop + this.toolbarSize.y;
		var viewY = window.scrollY + window.innerHeight;
		
		var newSize = this.getWindowSize();
		var sizeChanged = (newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y);
		this.windowSize = newSize;
		
		var newState = {
			width: this.toolbarSize.x,
			height: this.toolbarSize.y
		};
		
		if (viewY > maxY && (sizeChanged || this.mode !== 'inline')) {
			this.mode = 'inline';
			newState.top = 0;
			newState.position = 'absolute';
			this.setState(newState);
		} else if (viewY <= maxY && (sizeChanged || this.mode !== 'fixed')) {
			this.mode = 'fixed';
			newState.top = window.innerHeight - this.toolbarSize.y;
			newState.position = 'fixed';
			this.setState(newState);
		}
	},
	
	render: function() {
		var wrapperStyle = {
			position: 'relative',
			height: this.state.height
		};
		var toolbarProps = blacklist(this.props, 'children', 'style');
		var toolbarStyle = _.extend(this.props.style || {}, {
			position: this.state.position,
			top: this.state.top,
			width: this.state.width,
			height: this.state.height
		});
		return (
			<div ref="wrapper" style={wrapperStyle}>
				<div ref="toolbar" style={toolbarStyle} {...toolbarProps}>{this.props.children}</div>
			</div>
		);
	}
});

module.exports = Toolbar;
