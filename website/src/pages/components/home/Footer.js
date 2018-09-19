import React, { Component } from 'react';
import Container from '../../../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import theme from '../../../../theme';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.background)}>
				<Container>
					<p>Created by <a href="http://twitter.com/jedwatson" className={compose(styles.list_links_anchor)}>@jedwatson</a>, <a href="http://twitter.com/bladey" className={compose(styles.list_links_anchor)}>@bladey</a> and <a href="http://twitter.com/jossmackison" className={compose(styles.list_links_anchor)}>@jossmackison</a> at <a href="http://www.thinkmill.com.au/" className={compose(styles.list_links_anchor)}>Thinkmill</a>, and other <a href="https://github.com/keystonejs/keystone/contributors" className={compose(styles.list_links_anchor)}>contributors</a> under the <a href="http://opensource.org/licenses/MIT" className={compose(styles.list_links_anchor)}>MIT License</a></p>
					<ul className={compose(styles.list_links)}>
						<li className={compose(styles.list_links_item)}><Link to="/getting-started" className={compose(styles.list_links_anchor)}>Getting Started</Link></li>
						<li className={compose(styles.list_links_item)}><Link to="/documentation" className={compose(styles.list_links_anchor)}>Documentation</Link></li>
						<li className={compose(styles.list_links_item)}><a className={compose(styles.list_links_anchor)} href="https://github.com/keystonejs/keystone">Github Project</a></li>
						<li className={compose(styles.list_links_item)}><a className={compose(styles.list_links_anchor)} href="https://groups.google.com/forum/#!forum/keystonejs">Google Group</a></li>
						<li className={compose(styles.list_links_item)}><a className={compose(styles.list_links_anchor)} href="http://demo.keystonejs.com/">Demo Website</a></li>
					</ul>
				</Container>
			</div>
		);
	}
};

const styles = {
	list_links: {
		listStyle: 'none',
		marginLeft: '0',
		marginBottom: '0',
	},
	list_links_item: {
		display: 'inline-block',
		paddingLeft: '0.625rem',
		paddingRight: '0.625rem',
	},
	list_links_anchor: {
		textDecoration: 'none',
		color: '#00263e',
		':hover': {
			textDecoration: 'underline',
		},
	},
	background: {
		backgroundColor: theme.color.gray05,
		paddingTop: '3rem',
		paddingBottom: '3rem',
		width: '100%',
		textAlign: 'center',
		color: theme.color.gray50,
		fontSize: '0.9rem',
	},
};
