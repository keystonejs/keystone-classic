import React from 'react';
import Navigation from 'components/navigation';
import Sidebar from 'components/sidebar';
import { rhythm } from 'utils/typography';
import { compose, presets } from 'glamor';
import Drawer from 'react-motion-drawer';
import { Scrollbars } from 'react-custom-scrollbars';
require('../css/prism-coy.css');
require('typeface-roboto');

import Page from './template-doc-page';

export default class DocumentLayout extends React.Component {
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
		const edges = data.allMarkdownRemark.edges;
		const body = markdownRemark.html;
		const path = markdownRemark.parent.relativePath;

		// TODO must be a better way to do this
		// also, `join` is because some pages still have multiple H1s
		const title = markdownRemark.headings.filter(h => h.depth === 1).map(h => h.value).join(', ');

		const sidebar = <Sidebar items={edges.map(e => e.node)} />;

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
				{/* <Navigation
					home="/"
					location={this.props.location}
					openSidebar={() => {
						this.setState({ sidebarOpen: true });
					}}
				/> */}
				{/* <Drawer
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
							{sidebar}
						</div>
					</div>
				</Drawer> */}
				{/* <Scrollbars
					autoHeight
					autoHeightMin={`calc(100vh - ${rhythm(5)})`}
					universal
					autoHide
				>
				</Scrollbars> */}
				{sidebar}
				<Page
					body={body}
					editPath={editPath}
					siteTitle={siteTitle}
					title={title}
				/>
			</div>
		);
	}
};

// TODO only select headings of depth 1
export const pageQuery = `
query MarkdownTemplate($slug: String!) {
	site {
		siteMetadata {
			title
		}
	}
	allMarkdownRemark {
		edges {
			node {
				section
				slug
				headings {
					value
					depth
				}
			}
		}
	}
	markdownRemark(slug: { eq: $slug }) {
		parent {
			...on File {
				relativePath
			}
		}
		slug
		headings {
			value
			depth
		}
		html
	}
}
`;
