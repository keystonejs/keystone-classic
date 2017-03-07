import React from 'react';
import Link from 'gatsby-link';
import typography, { rhythm, scale } from '../utils/typography';
import { merge, media, presets, style } from 'glamor';
import Sticky from 'react-stickynode';

import menuItems from '../../docs/menu.yaml';
class Sidebar extends React.Component {
	render () {
		return (
			<Sticky
				top={85}
			>
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
						{menuItems.map((section) => {
							return (
								<div
									css={{
										marginBottom: rhythm(1),
									}}
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
										{Object.keys(section.links).map((title) => (
											<Item
												url={section.links[title]}
												title={title}
											/>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				</nav>
			</Sticky>
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
