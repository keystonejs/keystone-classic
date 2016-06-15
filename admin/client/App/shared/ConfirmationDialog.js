/**
 * Renders a confirmation dialog modal
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, ModalBody, ModalFooter, Button } from 'elemental';

class ConfirmationDialog extends Component {
	componentWillReceiveProps (nextProps) {
		// Focus the cancel button when the confirmation dialog is opened
		if (nextProps.isOpen) {
			setTimeout(() => {
				const cancel = findDOMNode(this.refs.cancel);
				cancel.focus();
			}, 0);
		}
	}
	getBodyHtml () {
		return {
			__html: this.props.body,
		};
	}
	render () {
		const {
			cancelLabel,
			confirmationLabel,
			confirmationType,
			isOpen,
			onCancel,
			onConfirmation,
		} = this.props;

		return (
			<Modal
				onCancel={onCancel}
				width={400}
				isOpen={isOpen}
				backdropClosesModal
			>
				<ModalBody>
					<div dangerouslySetInnerHTML={this.getBodyHtml()} />
				</ModalBody>
				<ModalFooter>
					<Button size="sm" type={confirmationType} onClick={onConfirmation}>
						{confirmationLabel}
					</Button>
					<Button ref="cancel" size="sm" type="link-cancel" onClick={onCancel}>
						{cancelLabel}
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
};
ConfirmationDialog.propTypes = {
	body: PropTypes.string,
	cancelLabel: PropTypes.string,
	confirmationLabel: PropTypes.string,
	confirmationType: PropTypes.oneOf(['danger', 'warning', 'primary']),
	onCancel: PropTypes.func,
	onConfirmation: PropTypes.func,
};
ConfirmationDialog.defaultProps = {
	cancelLabel: 'Cancel',
	confirmationLabel: 'Ok',
	confirmationType: 'danger',
	isOpen: false,
};

export default ConfirmationDialog;
