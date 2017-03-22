import React, { Component } from 'react';
import Container from '../../../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import theme from '../../../../theme';
import { rhythm } from 'utils/typography';
import { version } from '../../../../../package.json';
import logo from '../../../../images/logo-inverted.svg';
import { EntypoNetwork, EntypoTwitter, EntypoGithub } from 'react-entypo';

import continental from '../../../../images/brand-continental.png';
import event_cinemas from '../../../../images/brand-event_cinemas.png';
import macmillan from '../../../../images/brand-macmillan.png';
import sony from '../../../../images/brand-sony.png';
import vodafone from '../../../../images/brand-vodafone.png';
import westpac from '../../../../images/brand-westpac.png';

export default class Header extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<div className={compose(styles.intro)}>
						<img src={logo} style={{ width: '93px' }}/>
						<h1 className={compose(styles.intro__title)}>Node.js CMS & web app platform</h1>
						<p className={compose(styles.intro__lead)}>Keystone is an open source framework for developing database-driven websites, applications and APIs in Node.js. Built on Express and MongoDB.</p>
						<div className={compose(styles.home_header_buttons)}>
							<Link to="" className={compose(styles.button_home, styles.button_home_primary)}>Get Started</Link> <Link to="" className={compose(styles.button_home, styles.button_home_inverse)}>Try the Demo</Link>
						</div>
						<ul className={compose(styles.list_links)}>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}>Read the Documentation</Link></li>
							<li className={compose(styles.list_item)}>Current Version {version}</li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}>What's New</Link></li>
							<li className={compose(styles.list_item)}>Free and Open Source (MIT)</li>
						</ul>
						<ul className={compose(styles.list_links)}>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoNetwork /> See Examples</Link></li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoTwitter /> Follow @KeysoneJS on Twitter</Link></li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoGithub /> Star on GitHub</Link></li>
						</ul>
						<p className={compose(styles.heading_text)}>Keystone powers websites, apps and APIs for:</p>
						<div className={compose(styles.home_header_brands)}>
							<img src={continental} className={compose(styles.header_brand_img)}/>
							<img src={westpac} className={compose(styles.header_brand_img)}/>
							<img src={sony} className={compose(styles.header_brand_img)}/>
							<img src={event_cinemas} className={compose(styles.header_brand_img)}/>
							<img src={vodafone} className={compose(styles.header_brand_img)}/>
							<img src={macmillan} className={compose(styles.header_brand_img)}/>
						</div>
					</div>
				</Container>
			</div>
		);
	}
};

const styles = {
	wrapper: {
		background: 'linear-gradient(160deg, #34b6d9, #3464d9)',
		color: 'white',
	},
	image: {
		maxWidth: '93px',
	},
	// intro
	intro: {
		paddingBottom: rhythm(2),
		paddingTop: rhythm(2),
		textAlign: 'center',
	},
	intro__title: {
		color: 'inherit',
		fontSize: '3em',
		fontWeight: '200',
		marginBottom: '1em',
	},
	intro__lead: {
		color: 'inherit',
		fontSize: '1.2em',
		fontWeight: '300',
		opacity: '0.7',
	},
	list_links: {
		listStyle: 'none',
		marginTop: '1.2em',
	},
	list_links_item: {
		display: 'inline-block',
		paddingRight: '10px',
		color: 'inherit',
		fontSize: '1.2em',
	},
	list_item: {
		display: 'inline-block',
		paddingRight: '10px',
		color: 'inherit',
		opacity: '0.7',
	},
	home_header_buttons: {
		marginTop: '8em',
		marginBottom: '3em',
	},
	heading_text: {
		opacity: '0.7',
		fontSize: '1.2em',
	},
	button_home: {
		textTransform: 'uppercase',
		margin: '1em',
		fontSize: '1.33em',
		textDecoration: 'none',
		paddingLeft: '2em',
		paddingRight: '2em',
		paddingTop: '0.7em',
		paddingBottom: '0.7em',
		borderRadius: '6px',
		fontWeight: '300',
		border: '2px solid white',
	},
	button_home_primary: {
		backgroundColor: 'white',
		color: theme.color.blue,
	},
	button_home_inverse: {
		color: 'white',
	},
	home_header_brands: {
		width: '100%',
		flexFlow: 'row-wrap',
	},
	header_brand_img: {
		padding: '20px',
	},
};
