import React from 'react';
import Link from 'gatsby-link';
import { rhythm, scale } from 'utils/typography';
import MenuIcon from 'react-icons/lib/md/menu';
import gray from 'gray-percentage';
import Headroom from 'react-headroom';

import theme from '../theme';
import invertedLogo from '../images/logo-inverted.svg';
import Container from './Container';

export default ({ home = '/', openSidebar }) => {
	return (
		<Headroom
			wrapperStyle={{
				marginBottom: rhythm(1 / 2),
			}}
			style={{
				WebkitTransform: 'translate3d(0,0,0)',
				background: '#34a2d9',
				transition: 'background 250ms',
			}}
		>
			<Container>
				<div onClick={openSidebar}>
					<MenuIcon
						fill={gray(85, 0, true)}
						css={{
							...scale(4 / 5),
							float: 'left',
							display: 'inline-block',
							cursor: 'pointer',
							lineHeight: rhythm(1),
							position: 'relative',
							top: -2,
							marginLeft: rhythm(-1 / 2),
							paddingRight: rhythm(1 / 2),
							verticalAlign: 'middle',
							width: 40,

							[theme.breakpoint.mediumUp]: {
								display: 'none',
							},
						}}
					/>
				</div>
				<Link
					to={home}
					css={{
						display: 'block',
						lineHeight: rhythm(1),
						textDecoration: 'none',
					}}
					>
					<img
						src={invertedLogo}
						css={{
							display: 'inline-block',
							height: rhythm(1),
							marginBottom: 0,
							marginRight: rhythm(1 / 2),
							verticalAlign: 'top',
						}}
					/>
					<h1
						css={{
							...scale(2 / 5),
							color: 'white',
							display: 'inline-block',
							lineHeight: rhythm(1),
							margin: 0,
							verticalAlign: 'top',
						}}
					>
						Keystone
					</h1>
				</Link>
			</Container>
		</Headroom>
	);
};
