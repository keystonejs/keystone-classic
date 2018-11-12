import React from 'react';
require('../css/prism-coy.css');
require('../css/styles.css');
require('typeface-roboto');

import Page from './template-doc-page';
import Navbar from '../components/Navbar';

export default class DocumentLayout extends React.Component {
	constructor (props) {
		super(props);

	}

	getNavItems = () => {
		const { edges } = this.props.data.allMarkdownRemark;
		let currentSection;
		const sections = {};

		edges.forEach(edge => {
			const { section } = edge.node.fields;

			const newSection = section !== currentSection;
			currentSection = section;

			if (newSection) sections[section] = [];
		});

		edges.forEach(edge => {
			const { section, slug } = edge.node.fields;

			const label = edge.node.headings
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
		const editPath = `
			https://github.com/keystonejs/keystone/blob/master/docs/${path}
		`;

		return (
			<div>
				<Navbar items={this.getNavItems()} pathname={this.props.location.pathname} />
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


// { headings, section, slug }
export const pageQuery = graphql`
query MarkdownTemplate($slug: String!) {
	site {
		siteMetadata {
			title
		}
	}
	allMarkdownRemark {
      edges {
        node {
          fields {
            slug
		  	section
          }
          headings(depth: h1) {
            value
          }
        }
      }
    }
	markdownRemark(fields: { slug: { eq: $slug } }) {
		parent {
			...on File {
				relativePath
			}
		}
		headings(depth: h1) {
			value
		}
		html
	}
}
`;
