import React, { PropTypes } from 'react';
import Link from 'gatsby-link';

export default function Item ({ title, url, isActive, depth }) {
	return (
		<Link
			css={[
				styles.link,
				styles['depth__' + depth],
				isActive && styles.linkActive,
				isActive && depth === 2 && styles.depth__2__active,
			]}
			to={url}
		>
			{title}
		</Link>
	);
}

Item.propTypes = {
	depth: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	link: {
		display: 'flex',
		alignItems: 'center',
		color: 'white',
		padding: '0.3125rem 1rem',
		textDecoration: 'none',
		transition: 'opacity 100ms',

		':hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
		},
	},
	linkActive: {
		backgroundColor: 'rgba(0, 0, 0, 0.15)',
		fontWeight: '600',
		':hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
		},
	},

	depth__1: {
		fontSize: '1rem',
		marginLeft: '1.875rem',
		marginTop: '0.3125rem',
	},
	depth__2: {
		fontSize: '0.85rem',
		marginLeft: '2.875rem',
		borderLeft: '2px solid rgba(255,255,255,0.2)',
	},
	depth__2__active: {
		borderColor: 'rgba(255,255,255,0.8)',
	},
};
