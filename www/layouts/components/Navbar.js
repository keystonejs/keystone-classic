import React, { PropTypes } from 'react';
import Link from 'gatsby-link';
import theme from '../../theme';
import invertedLogo from '../../images/logo-inverted.svg';

function Item ({ path, label }) {
	return (
		<li css={styles.item}>
			<Link to={path} css={styles.link}>{label}</Link>
		</li>
	);
};

export default function Navbar ({ isHome, items }) {
	return (
		<nav css={styles.nav}>
			<Link to="/" css={styles.brand}>
				<img
					src={invertedLogo}
					css={styles.brandIcon}
				/>
			</Link>
			<ul css={styles.list}>
				{items.map(s => (
					<Item
						key={s.slug}
						label={s.section}
						path={s.slug}
					/>
				))}
			</ul>
		</nav>
	);
};

Navbar.PropTypes = {
	isHome: PropTypes.bool,
	items: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	nav: {
		alignItems: 'center',
		backgroundColor: theme.color.blue,
		display: 'flex',
		justifyContent: 'space-between',
	},
	list: {
		display: 'inline-flex',
		listStyle: 'none',
		margin: 0,
	},

	// brand
	brand: {
		display: 'block',
		lineHeight: 0,
		textDecoration: 'none',
		paddingLeft: '1em',
		paddingRight: '1em',
	},
	brandIcon: {
		height: 30,
		margin: 0,
	},

	// items
	item: {
		display: 'inline-flex',
		margin: 0,
	},
	link: {
		color: 'white',
		display: 'block',
		padding: '1em',
		textDecoration: 'none',
	},
	link__active: {
		opacity: 1,
	},
};
