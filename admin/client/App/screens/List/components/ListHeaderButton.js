import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import { DropdownButton, Glyph } from '../../../elemental';

function ListHeaderButton ({ className, label, glyph, ...props }) {
	return (
		<DropdownButton block {...props}>
			<Glyph name={glyph} aphroditeStyles={classes.glyph} />
			<span className={css(classes.label)}>{label}</span>
		</DropdownButton>
	);
};

ListHeaderButton.propTypes = {
	glyph: PropTypes.string.isRequired,
};

// show an icon on small screens where real estate is precious
// otherwise render the label
const classes = StyleSheet.create({
	glyph: {
		'display': 'none',

		'@media (max-width: 500px)': {
			display: 'inline-block',
		},
	},
	label: {
		'display': 'inline-block',

		'@media (max-width: 500px)': {
			display: 'none',
		},
	},
});

module.exports = ListHeaderButton;
