import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import concatClassnames from '../../../utils/concatClassnames';

const classes = StyleSheet.create(styles);

function FormInput ({ className, id, ...props }, { formFieldId, formLayout }) {
	props.id = id || formFieldId;
	props.className = css(
		classes.FormInput,
		formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
		...concatClassnames(className)
	);

	return (
		<input {...props} />
	);
};


FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};
FormInput.propTypes = {
	type: PropTypes.string,
};
FormInput.defaultProps = {
	type: 'text',
};

module.exports = FormInput;
