import React, { Component } from 'react';
import Link from 'gatsby-link';
// import MenuIcon from 'react-icons/lib/md/menu';
import DemoIcon from 'react-icons/lib/go/link-external';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { presets } from 'glamor';

import typography, { rhythm, scale } from '../utils/typography';
import invertedLogo from '../images/logo-inverted.svg';
import theme from '../theme';

class Sidebar extends Component {
	render () {
		return (
			<aside css={styles.sidebar}>
				<Link to="/" css={styles.header__brand}>
					<img src={invertedLogo} height="60" css={{ margin: 0 }} />
				</Link>
				<div css={styles.header__links}>
					<a href="http://demo.keystonejs.com" target="_blank" css={styles.header__link}>
						<DemoIcon css={styles.header__linkIcon} />
						Demo
					</a>
					<a href="https://github.com/keystonejs/keystone" target="_blank" css={styles.header__link}>
						<GithubIcon css={styles.header__linkIcon} />
						GitHub
					</a>
				</div>
				<nav>
					<Menu items={this.props.items} />
				</nav>
			</aside>
		);
	};
}

const Menu = ({ items }) => {
	let section;
	const list = items.map(item => {
		const firstH1 = item.headings.filter(h => h.depth === 1)[0];
		const title = firstH1 && firstH1.value || '(no title)';
		const isNewSection = item.section !== section;
		section = item.section;

		return (
			<Item
				isSection={isNewSection}
				key={item.slug}
				title={isNewSection ? section : title}
				url={item.slug}
			/>
		);
	});

	return (
		<ul css={styles.menu}>{list}</ul>
	);
};

function Item ({ isSection, title, url }) {
	return (
		<li css={[styles.item, isSection && styles.item__section]}>
			<Link
				onlyActiveOnIndex
				css={[styles.link, isSection && styles.link__section]}
				activeStyle={styles.link__active}
				to={url}
			>
				{title}
			</Link>
		</li>
	);
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	sidebar: {
		backgroundColor: theme.color.blueDark,
		color: 'white',
		fontSize: '0.9em',
		letterSpacing: '0.01em',
		lineHeight: typography.options.baseLineHeight,
		width: '100%',

		[presets.Tablet]: {
			bottom: 0,
			height: '100%',
			left: 0,
			overflowY: 'auto',
			paddingBottom: '2em',
			position: 'fixed',
			top: 0,
			width: theme.sidebar.width,
		},
	},

	// header
	header__brand: {
		display: 'block',
		lineHeight: 0,
		padding: '2em 0',
		textAlign: 'center',
		textDecoration: 'none',
	},
	header__links: {
		display: 'flex',
	},
	header__linkIcon: {
		marginRight: '0.5em',
	},
	header__link: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		color: 'white',
		display: 'flex',
		flex: 1,
		height: '44px',
		justifyContent: 'center',
		lineHeight: '44px',
		opacity: 0.9,
		padding: '0 1em',
		textAlign: 'center',
		textDecoration: 'none',

		':hover': {
			opacity: 1,
		},

		':first-child': {
			marginRight: 1,
		},
	},

	// menu
	menu: {
		listStyle: 'none',
		margin: 0,
		paddingRight: '1em',
	},

	// item
	item: {
		fontWeight: 300,
		margin: '0 0 2px',
	},
	item__section: {
		// fontWeight: '500',
		fontSize: '1.4em',
		marginTop: '1.8em',
		opacity: 0.66,
		textTransform: 'uppercase',
	},
	link: {
		borderBottomRightRadius: 3,
		borderTopRightRadius: 3,
		color: 'white',
		display: 'block',
		padding: `0.5em 1em`,
		textDecoration: 'none',
		transition: 'opacity 100ms',

		':hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
		},
	},
	link__section: {
		opacity: 1,
	},
	link__active: {
		backgroundColor: theme.color.blue,
		opacity: 1,
	},
};

export default Sidebar;
