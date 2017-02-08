import React, { PropTypes } from 'react';
import { FormInput } from '../../admin/client/App/elemental';
import { fade } from '../../admin/client/utils/color';
import theme from '../../admin/client/theme';

function FileChangeMessage ({ style, color, ...props }) {
	const styles = {
		marginRight: 10,
		minWidth: 0,
		...style,
	};

	if (color !== 'default') {
		styles.backgroundColor = fade(theme.color[color], 10);
		styles.borderColor = fade(theme.color[color], 30);
		styles.color = theme.color[color];
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
	color: PropTypes.oneOf(['danger', 'default', 'success']),
};
FileChangeMessage.defaultProps = {
	color: 'default',
};

module.exports = FileChangeMessage;
