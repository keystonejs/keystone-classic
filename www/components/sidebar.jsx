import React, { Component } from 'react';
import Link from 'gatsby-link';
import typography, { rhythm, scale } from '../utils/typography';
import { presets } from 'glamor';

class Sidebar extends Component {
	render () {
		return (
			<nav
				className="sidebar"
				css={{
					...scale(-1 / 5),
					lineHeight: typography.options.baseLineHeight,
					marginTop: rhythm(1 / 4),
					width: '100%',
					[presets.Tablet]: {
						display: 'block',
						width: rhythm(10),
						float: 'left',
						paddingRight: rhythm(1),
					},
				}}
			>
				<Menu items={this.props.items} />
			</nav>
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
		<ul css={{ margin: 0, listStyle: 'none' }}>{list}</ul>
	);
};

const Item = ({ isSection, title, url }) => {
	const itemStyle = Object.assign({
		marginBottom: rhythm(1 / 2),
		width: '100%',
	}, isSection ? { fontSize: 24 } : null);
	const linkStyle = {
		paddingBottom: rhythm(1 / 4),
		textDecoration: 'none',
	};
	const linkStyleActive = {
		color: 'black',
		textDecoration: 'underline',
	};

	return (
		<li css={itemStyle}>
			<Link
				onlyActiveOnIndex
				css={linkStyle}
				activeStyle={linkStyleActive}
				to={url}
			>
				{title}
			</Link>
		</li>
	);
};

export default Sidebar;
