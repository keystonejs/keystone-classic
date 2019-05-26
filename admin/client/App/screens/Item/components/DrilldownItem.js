import { css } from 'glamor';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Glyph } from '../../../elemental';

import theme from '../../../../theme';

function DrilldownItem ({ className, href, label, separate, separator, style, ...props }) {
	props.className = css(classes.item, className);

	// remove horizontal padding
	const styles = {
		paddingLeft: 0,
		paddingRight: 0,
		...style,
	};

	return (
		<li {...props}>
			<Button
				component={Link}
				style={styles}
				to={href}
				variant="link"
			>
				{label}
			</Button>
			{separate && (
				<span className={css(classes.separator)}>
					{separator}
				</span>
			)}
		</li>
	);
};

DrilldownItem.propTypes = {
	href: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	separate: PropTypes.bool, // FIXME verb; could be better
	separator: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
};
DrilldownItem.defaultProps = {
	separator: <Glyph name="chevron-right" />,
};

const classes = {
	item: {
		display: 'inline-block',
		margin: 0,
		padding: 0,
		verticalAlign: 'middle',
	},
	separator: {
		color: theme.color.gray40,
		marginLeft: '0.5em',
		marginRight: '0.5em',
	},
};

module.exports = DrilldownItem;
