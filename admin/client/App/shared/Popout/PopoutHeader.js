/**
 * Render a header for a popout
 */

import React from 'react';
import Transition from 'react-addons-css-transition-group';

const PopoutHeader = React.createClass({
	displayName: 'PopoutHeader',
	propTypes: {
		leftAction: React.PropTypes.func,
		leftIcon: React.PropTypes.string,
		title: React.PropTypes.string.isRequired,
		transitionDirection: React.PropTypes.oneOf(['next', 'prev']),
	},
	render () {
		// If we have a left action and a left icon, render a header button
		var headerButton = (this.props.leftAction && this.props.leftIcon) ? (
			<button
				key={'button_' + this.props.transitionDirection}
				type="button"
				className={'Popout__header__button octicon octicon-' + this.props.leftIcon}
				onClick={this.props.leftAction}
			/>
		) : null;
		// If we have a title, render it
		var headerTitle = this.props.title ? (
			<span
				key={'title_' + this.props.transitionDirection}
				className="Popout__header__label"
			>
				{this.props.title}
			</span>
		) : null;

		return (
			<div className="Popout__header">
				<Transition
					transitionName="react-transitiongroup-fade"
					transitionEnterTimeout={190}
					transitionLeaveTimeout={190}
				>
					{headerButton}
				</Transition>
				<Transition
					transitionName={'Popout__pane-' + this.props.transitionDirection}
					transitionEnterTimeout={350}
					transitionLeaveTimeout={350}
				>
					{headerTitle}
				</Transition>
			</div>
		);
	},
});

module.exports = PopoutHeader;
