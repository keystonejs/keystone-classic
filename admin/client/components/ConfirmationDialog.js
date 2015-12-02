import React from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'elemental';

module.exports = React.createClass({
	displayName: 'ConfirmationDialog',

	propTypes: {
		body: React.PropTypes.string.isRequired,
		cancelLabel: React.PropTypes.string,
		confirmationLabel: React.PropTypes.string,
		confirmationType: React.PropTypes.oneOf(['danger', 'warning', 'primary']),
		onCancel: React.PropTypes.func.isRequired,
		onConfirmation: React.PropTypes.func.isRequired,
	},

	getDefaultProps () {
		return {
			cancelLabel: 'Cancel',
			confirmationLabel: 'Ok',
			confirmationType: 'danger'
		};
	},

	getBodyHtml () {
		return {
			__html: this.props.body
		};
	},

	render () {
		return (
			<Modal onCancel={this.props.onCancel} width={400} isOpen backdropClosesModal>
				<ModalBody>
					<div dangerouslySetInnerHTML={this.getBodyHtml()} />
				</ModalBody>
				<ModalFooter>
					<Button size="sm" type={this.props.confirmationType} onClick={this.props.onConfirmation}>
						{this.props.confirmationLabel}
					</Button>
					<Button size="sm" type="link-cancel" onClick={this.props.onCancel}>
						{this.props.cancelLabel}
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
});
