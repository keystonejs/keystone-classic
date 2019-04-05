import React, { PropTypes } from 'react';
import { css } from 'glamor';
import GlyphButton from '../GlyphButton';
import theme from '../../../theme';

function ModalHeader ({
	children,
	className,
	showCloseButton,
	text,
	...props
}, {
	onClose,
}) {
	// Property Violation
	if (children && text) {
		console.error('Warning: ModalHeader cannot render `children` and `text`. You must provide one or the other.');
	}

	return (
		<div {...props} className={css(classes.header, className)}>
			<div className={css(classes.grow)}>
				{text ? (
					<h4 className={css(classes.text)}>
						{text}
					</h4>
				) : children}
			</div>
			{!!onClose && showCloseButton && (
				<GlyphButton
					cssStyles={classes.close}
					color="cancel"
					glyph="x"
					onClick={onClose}
					variant="link"
				/>
			)}
		</div>
	);
};

ModalHeader.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func,
	showCloseButton: PropTypes.bool,
	text: PropTypes.string,
};
ModalHeader.contextTypes = {
	onClose: PropTypes.func.isRequired,
};

const classes = {
	header: {
		alignItems: 'center',
		borderBottom: `2px solid ${theme.color.gray10}`,
		display: 'flex',
		paddingBottom: theme.modal.padding.header.vertical,
		paddingLeft: theme.modal.padding.header.horizontal,
		paddingRight: theme.modal.padding.header.horizontal,
		paddingTop: theme.modal.padding.header.vertical,
	},

	// fill space to push the close button right
	grow: {
		flexGrow: 1,
	},

	// title text
	text: {
		color: 'inherit',
		fontSize: 18,
		fontWeight: 500,
		lineHeight: 1,
		margin: 0,
	},
};

module.exports = ModalHeader;
