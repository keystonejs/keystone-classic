import React from 'react';

const buttonBaseClassname = 'Popout__footer__button Popout__footer__button--';

var PopoutFooter = React.createClass({
	displayName: 'PopoutFooter',
	propTypes: {
		children: React.PropTypes.node,
		primaryButtonAction: React.PropTypes.func,
		primaryButtonIsSubmit: React.PropTypes.bool,
		primaryButtonLabel: React.PropTypes.string,
		secondaryButtonAction: React.PropTypes.func,
		secondaryButtonLabel: React.PropTypes.string,
	},
	
	renderPrimaryButton () {
		if (!this.props.primaryButtonLabel) return null;
		
		return (
			<button type={this.props.primaryButtonIsSubmit ? 'submit' : 'button'} className={buttonBaseClassname + 'primary'} onClick={this.props.primaryButtonAction}>
				{this.props.primaryButtonLabel}
			</button>
		);
	},
	
	renderSecondaryButton () {
		if (!this.props.secondaryButtonAction || !this.props.secondaryButtonLabel) return null;
		
		return (
			<button type="button" className={buttonBaseClassname + 'secondary'} onClick={this.props.secondaryButtonAction}>
				{this.props.secondaryButtonLabel}
			</button>
		);
	},
	
	render () {
		return (
			<div className="Popout__footer">
				{this.renderPrimaryButton()}
				{this.renderSecondaryButton()}
				{this.props.children}
			</div>
		);
	}
	
});

module.exports = PopoutFooter;
