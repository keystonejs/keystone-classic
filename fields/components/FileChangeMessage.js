import React, { PropTypes } from 'react';
import { FormInput } from 'elemental';
import { fade } from '../../admin/client/utils/color';
import theme from '../../admin/client/theme';

function FileChangeMessage ({ style, type, ...props }) {
	const styles = {
		marginRight: 10,
		minWidth: 0,
		...style,
	};

	if (type === 'danger' || type === 'success') {
		styles.backgroundColor = fade(theme.color[type], 10);
		styles.borderColor = fade(theme.color[type], 30);
		styles.color = theme.color[type];
	}

	return (
		<FormInput
			noedit
			style={styles}
			{...props}
		/>
	);
};

FileChangeMessage.propTypes = {
	type: PropTypes.oneOf(['danger', 'default', 'success']),
};
FileChangeMessage.defaultProps = {
	type: 'default',
};

module.exports = FileChangeMessage;
