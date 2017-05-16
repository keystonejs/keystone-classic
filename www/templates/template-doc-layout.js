import React from 'react';
require('../css/prism-coy.css');
require('../css/styles.css');
require('typeface-roboto');

import Page from './template-doc-page';
import Navbar from '../components/Navbar';

export default class DocumentLayout extends React.Component {
	constructor (props) {
		super(props);

		this.getNavItems = this.getNavItems.bind(this);
	}
	getNavItems () {
		const { edges } = this.props.data.allMarkdownRemark;
		let currentSection;
		const sections = {};
		console.info(this.props.location.pathname);

		edges.forEach(({ node }) => {
			const { section } = node;

			console.log('matching path', node.slug === this.props.location.pathname);
			const newSection = section !== currentSection;
			currentSection = section;

			if (newSection) sections[section] = [];
		});

		edges.forEach(({ node }) => {
			const { headings, section, slug } = node;

			const label = headings
				.map(h => h.value)[0]
				|| '(no title)';

			sections[section].push({ label, slug });
		});

		return Object.keys(sections).map(s => ({
			section: s || '(no section)',
			items: sections[s],
		}));
	}
	render () {
		const { data, data: { markdownRemark } } = this.props;
		const { title: siteTitle } = data.site.siteMetadata;
		const body = markdownRemark.html;
		const path = markdownRemark.parent.relativePath;

		// TODO sorting should come from graphQL
		// also, `join` is because some pages still have multiple H1s
		const title = markdownRemark.headings.sort((a, b) => a.value.localeCompare(b.value)).map(h => h.value).join(', ');

		// TODO add file path to Markdown schema
		// NOTE pointing to `docs` until ready for `master`
		const editPath = `
			https://github.com/keystonejs/keystone/blob/docs/docs/${path}
		`;

		// console.log('data', this.props.data);
		// console.log('location', this.props.location);

		return (
			<div>
				<Navbar items={this.getNavItems()} />
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
				headings(depth: h1) {
					value
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
		headings(depth: h1) {
			value
		}
		html
	}
}
`;
