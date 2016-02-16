import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, ModalBody, ModalFooter, Button } from 'elemental';

class ConfirmationDialog extends Component {
	componentWillReceiveProps (nextProps) {
		if (nextProps.isOpen) {
			setTimeout(e => {
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
		const { cancelLabel, confirmationLabel, confirmationType, isOpen, onCancel, onConfirmation } = this.props;
		return (
			<Modal onCancel={onCancel} width={400} isOpen={isOpen} backdropClosesModal>
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
	body: React.PropTypes.string,
	cancelLabel: React.PropTypes.string,
	confirmationLabel: React.PropTypes.string,
	confirmationType: React.PropTypes.oneOf(['danger', 'warning', 'primary']),
	onCancel: React.PropTypes.func,
	onConfirmation: React.PropTypes.func,
};
ConfirmationDialog.defaultProps = {
	cancelLabel: 'Cancel',
	confirmationLabel: 'Ok',
	confirmationType: 'danger',
	isOpen: false,
};

export default ConfirmationDialog;
