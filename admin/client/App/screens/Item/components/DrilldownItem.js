import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Glyph } from '../../../elemental';

import cssClassNames from '../../../../utils/cssClassNames';
import theme from '../../../../theme';

function DrilldownItem ({ className, href, label, separate, separator, style, ...props }) {
	props.className = cssClassNames([
		classes.item,
	], className);

	const styles = {
		paddingLeft: 0,
		paddingRight: 0,
		...style,
	};

	console.log('DrilldownItem separate', separate, separator);

	return (
		<li {...props}>
			<Button
				className="e2e-editform-header-back"
				component={Link}
				style={styles}
				to={href}
				variant="link"
				{...props}
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
	separator: PropTypes.string,
};
DrilldownItem.defaultProps = {
	separator: (
		<Glyph name="chevron-right" />
	),
};

const classes = StyleSheet.create({
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
});

module.exports = DrilldownItem;
