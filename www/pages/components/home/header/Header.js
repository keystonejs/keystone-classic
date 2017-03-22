import React, { Component } from 'react';
import Container from '../../../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import theme from '../../../../theme';
import { rhythm } from 'utils/typography';
import { version } from '../../../../../package.json';
import logo from '../../../../images/logo-inverted.svg';
import { EntypoNetwork, EntypoTwitter, EntypoGithub } from 'react-entypo';
export default class Header extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<div className={compose(styles.intro)}>
						<img src={logo} style={{ width: '93px' }}/>
						<h1 className={compose(styles.intro__title)}>Node.js CMS & web app platform</h1>
						<p className={compose(styles.intro__lead)}>Keystone is an open source framework for developing database-driven websites, applications and APIs in Node.js. Built on Express and MongoDB.</p>
						<div>
							<Link to="" style={{ color: 'white' }}>Get Started</Link> <Link to="" style={{ color: 'white' }}>Try the Demo</Link>
						</div>
						<ul className={compose(styles.list_links)}>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}>Read the Documentation</Link></li>
							<li className={compose(styles.list_links_item)}>Current Version {version}</li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}>What's New</Link></li>
							<li className={compose(styles.list_links_item)}>Free and Open Source (MIT)</li>
						</ul>
						<ul className={compose(styles.list_links)}>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoNetwork /> See Examples</Link></li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoTwitter /> Follow @KeysoneJS on Twitter</Link></li>
							<li className={compose(styles.list_links_item)}><Link to="" style={{ color: 'white' }}><EntypoGithub /> Star on GitHub</Link></li>
						</ul>
					</div>
				</Container>
			</div>
		);
	}
};

const styles = {
	wrapper: {
		backgroundColor: theme.color.blue,
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
	},
	list_links_item: {
		display: 'inline-block',
		paddingRight: '5px',
	},
};
