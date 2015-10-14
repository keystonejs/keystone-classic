import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';

var PopoutPane = React.createClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		onLayout: React.PropTypes.func
	},
	componentDidMount () {
		this.props.onLayout && this.props.onLayout(this.getDOMNode().offsetHeight);
	},
	render () {
		let className = classnames('Popout__pane', this.props.className);
		let props = blacklist(this.props, 'className', 'onLayout');
		return <div className={className} {...props} />;
	}
});

module.exports = PopoutPane;
