import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import theme from '../../../theme';

function ModalFooter ({
	align,
	className,
	...props
}) {
	return (
		<div {...props} className={css(classes.footer, classes['align__' + align], className)} />
	);
};

ModalFooter.propTypes = {
	align: PropTypes.oneOf(['center', 'left', 'right']),
	children: PropTypes.node,
	onClose: PropTypes.func,
	showCloseButton: PropTypes.bool,
	text: PropTypes.string,
};
ModalFooter.defaultProps = {
	align: 'left',
};

const classes = StyleSheet.create({
	footer: {
		borderTop: `2px solid ${theme.color.gray10}`,
		display: 'flex',
		paddingBottom: theme.modal.padding.footer.vertical,
		paddingLeft: theme.modal.padding.footer.horizontal,
		paddingRight: theme.modal.padding.footer.horizontal,
		paddingTop: theme.modal.padding.footer.vertical,
	},

	// alignment
	align__left: {
		justifyContent: 'flex-start',
	},
	align__center: {
		justifyContent: 'center',
	},
	align__right: {
		justifyContent: 'flex-end',
	},
});

module.exports = ModalFooter;
