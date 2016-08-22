/**
 * Renders a confirmation dialog modal
 */

import React, { Component, PropTypes } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'elemental';

class ConfirmationDialog extends Component {
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
				backdropClosesModal
				isOpen={isOpen}
				onCancel={onCancel}
				width={400}
			>
				<ModalBody>{this.props.body || <span />}</ModalBody>
				<ModalFooter>
					<Button autoFocus size="sm" type={confirmationType} onClick={onConfirmation}>
						{confirmationLabel}
					</Button>
					<Button size="sm" type="link-cancel" onClick={onCancel}>
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
	confirmationLabel: 'Okay',
	confirmationType: 'danger',
	isOpen: false,
};

export default ConfirmationDialog;
