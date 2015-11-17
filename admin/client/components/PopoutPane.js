import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

var PopoutPane = React.createClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		onLayout: React.PropTypes.func
	},
	componentDidMount () {
		if (this.props.onLayout) {
			this.props.onLayout(this.refs.el.offsetHeight);
		}
	},
	render () {
		let className = classnames('Popout__pane', this.props.className);
		let props = blacklist(this.props, 'className', 'onLayout');
		return <div ref="el" className={className} {...props} />;
	}
});

module.exports = PopoutPane;
