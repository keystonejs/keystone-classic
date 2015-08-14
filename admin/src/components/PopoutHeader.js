var React = require('react');
var Transition = React.addons.CSSTransitionGroup;

var PopoutHeader = React.createClass({
	displayName: 'PopoutHeader',
	propTypes: {
		leftAction: React.PropTypes.func,
		leftIcon: React.PropTypes.string,
		title: React.PropTypes.string.isRequired,
		transitionDirection: React.PropTypes.oneOf(['next', 'prev'])
	},
	
	render () {
		var headerButton = (this.props.leftAction && this.props.leftIcon) ? <button key={'button_' + Date.now()} type="button" className={'Popout__header__button octicon octicon-' + this.props.leftIcon} onClick={this.navigateBack} /> : null;
		var headerTitle = this.props.title ? <span key={'title_' + Date.now()} className="Popout__header__label">{this.props.title}</span> : null;
		
		return (
			<div className="Popout__header">
				<Transition transitionName="react-transitiongroup-fade">
					{headerButton}
				</Transition>
				<Transition transitionName={'Popout-pane-' + this.props.transitionDirection}>
					{headerTitle}
				</Transition>
			</div>
		);
	}
	
});

module.exports = PopoutHeader;
