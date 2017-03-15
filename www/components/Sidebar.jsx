import React from 'react';
import Link from 'gatsby-link';
import typography, { rhythm, scale } from '../utils/typography';
import { presets } from 'glamor';

import menuItems from '../../docs/menu.yaml';
class Sidebar extends React.Component {
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
						// position: 'fixed',
						// overflowY: 'scroll',
						width: rhythm(10),
						float: 'left',
						paddingRight: rhythm(1),
					},
				}}
			>
				<div>
					{menuItems.map((section, idx) => {
						return (
							<div
								css={{
									marginBottom: rhythm(1),
								}}
								key={idx}
							>
								<h3
									css={{
										marginBottom: rhythm(1 / 2),
										marginTop: 0,
									}}
								>
									{section.title}
								</h3>
								<ul
									css={{
										margin: 0,
										listStyle: 'none',
									}}
								>
									{Object.keys(section.links).map((title, idx) => (
										<Item
											key={idx}
											title={title}
											url={section.links[title]}
										/>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</nav>
		);
	};
}

const Item = ({ url, title }) => (
	<li
		style={{
			marginBottom: rhythm(1 / 2),
			width: '100%',
		}}
	>
		<Link
			onlyActiveOnIndex
			style={{
				paddingBottom: rhythm(1 / 4),
				textDecoration: 'none',
			}}
			activeStyle={{
				color: 'black',
				textDecoration: 'underline',
			}}
			to={url}
		>
			{ title }
		</Link>
	</li>
);

export default Sidebar;
