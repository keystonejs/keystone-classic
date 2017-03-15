import React from 'react';
import Navigation from 'components/navigation';
import Sidebar from 'components/sidebar';
import { rhythm } from 'utils/typography';
import { presets } from 'glamor';
import Drawer from 'react-motion-drawer';
import { Scrollbars } from 'react-custom-scrollbars';
require('../css/prism-coy.css');
require('typeface-libre-franklin');
require('typeface-ubuntu-mono');

import Container from '../components/Container';
import Page from './template-doc-page';

class DocumentLayout extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			sidebarOpen: false,
		};
	}
	componentDidMount () {
		// Create references to html/body elements
		this.htmlElement = document.querySelector('html');
		this.bodyElement = document.querySelector('body');
	}
	render () {
		// Freeze the background when the overlay is open.
		if (this.htmlElement && this.bodyElement) {
			if (this.state.mobileSidebarOpen) {
				this.htmlElement.style.overflow = 'hidden';
				this.bodyElement.style.overflow = 'hidden';
			} else {
				this.htmlElement.style.overflow = 'visible';
				this.bodyElement.style.overflow = 'visible';
			}
			// Always set the HTML overflowY to scroll so there's no weird jumping
			// around.
			this.htmlElement.style.overflowY = `scroll`;
		}

		const { data, data: { markdownRemark } } = this.props;
		const { title: siteTitle } = data.site.siteMetadata;
		const title = markdownRemark.frontmatter.title;
		const body = markdownRemark.html;
		const path = markdownRemark.parent.relativePath;

		// TODO add file path to Markdown schema
		// NOTE pointing to `docs` until ready for `master`
		const editPath = `
			https://github.com/keystonejs/keystone/blob/docs/docs/${path}
		`;

		// console.log('data', this.props.data);
		// console.log('location', this.props.location);
		// const activeSection = basepath(this.props.location.pathname)

		return (
			<div>
				<Navigation
					home="/"
					location={this.props.location}
					openSidebar={() => {
						this.setState({ sidebarOpen: true });
					}}
				/>
				<Drawer
					open={this.state.sidebarOpen}
					onChange={(open) => this.setState({ sidebarOpen: open })}
				>
					<div onClick={() => this.setState({ sidebarOpen: false })}>
						<div
							css={{
								background: 'white',
								minHeight: '100vh',
								height: '100%',
								padding: rhythm(3 / 4),
							}}
						>
							<Sidebar />
						</div>
					</div>
				</Drawer>
				<Container>
					<div
						css={{
							display: 'none',
							[presets.Tablet]: {
								display: 'block',
								position: 'fixed',
								height: `100vh`,
								float: 'left',
							},
						}}
					>
						<Scrollbars
							autoHeight
							autoHeightMin={`calc(100vh - ${rhythm(5)})`}
							universal
							autoHide
						>
							<Sidebar />
						</Scrollbars>
					</div>
					<div
						css={{
							paddingLeft: 0,
							[presets.Tablet]: {
								paddingLeft: rhythm(11),
							},
						}}
					>
						<Page
							body={body}
							editPath={editPath}
							siteTitle={siteTitle}
							title={title}
						/>
					</div>
				</Container>
			</div>
		);
	}
}

export default DocumentLayout;
export const pageQuery = `
query MarkdownTemplate($slug: String!) {
	site {
		siteMetadata {
			title
		}
	}
	markdownRemark(slug: { eq: $slug }) {
		parent {
			...on File {
				relativePath
			}
		}
		slug
		html
		frontmatter {
			title
		}
	}
}
`;
