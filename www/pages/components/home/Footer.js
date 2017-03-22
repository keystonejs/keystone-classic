import React, { Component } from 'react';
import Container from '../../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import theme from '../../../theme';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.background)}>
				<Container>
					<p>Created by <a href="http://twitter.com/jedwatson">@jedwatson</a>, <a href="http://twitter.com/bladey">@bladey</a> and <a href="http://twitter.com/jossmackison">@jossmackison</a> at <a href="http://www.thinkmill.com.au/">Thinkmill</a>, and other <a href="https://github.com/keystonejs/keystone/contributors">contributors</a> under the <a href="http://opensource.org/licenses/MIT">MIT License</a></p>
					<ul className={compose(styles.list_links)}>
						<li className={compose(styles.list_links_item)}><Link to="">Getting Started</Link></li>
						<li className={compose(styles.list_links_item)}><Link to="">Documentation</Link></li>
						<li className={compose(styles.list_links_item)}><a href="https://github.com/keystonejs/keystone">Github Project</a></li>
						<li className={compose(styles.list_links_item)}><a href="https://groups.google.com/forum/#!forum/keystonejs">Google Group</a></li>
						<li className={compose(styles.list_links_item)}><a href="http://demo.keystonejs.com/">Demo Website</a></li>
						<li className={compose(styles.list_links_item)}><Link to="">Examples</Link></li>
					</ul>
				</Container>
			</div>
		);
	}
};

const styles = {
	list_links: {
		listStyle: 'none',
	},
	list_links_item: {
		display: 'inline-block',
		paddingRight: '5px',
		textDecoration: 'none',
	},
	background: {
		backgroundColor: theme.color.gray10,
		paddingTop: '1em',
		width: '100%',
		textAlign: 'center',
	},
};
