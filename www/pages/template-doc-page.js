import React from 'react';
import DocumentTitle from 'react-document-title';
import get from 'lodash/get';
import { presets } from 'glamor';
import { rhythm } from '../utils/typography';

class MarkdownTemplate extends React.Component {
	render () {
		console.log(this.props.data);
		const siteTitle = get(this.props, 'data.site.siteMetadata.title');
		const title = get(this.props, 'data.markdownRemark.frontmatter.title');
		const body = get(this.props, 'data.markdownRemark.html');
		const path = get(this.props, 'data.markdownRemark.parent.relativePath');

    // TODO add file path to Markdown schema.
		const edit = `https://github.com/keystonejs/keystone/blob/master/docs/${path}`;
		console.log(this.props.location);

		return (
			<DocumentTitle title={`${title} | ${siteTitle}`}>
				<section
					css={{
						maxWidth: '100%',
						paddingBottom: rhythm(1 / 2),
						[presets.Tablet]: {
							paddingTop: 0,
						},
					}}
        >
					<h1 css={{ marginTop: 0 }}>{title}</h1>
					<a
						href={edit}
						css={{
							display: 'block',
							marginBottom: rhythm(1),
						}}
          >
            Edit this Page
          </a>

					<div
						dangerouslySetInnerHTML={{ __html: body }}
          />
				</section>
			</DocumentTitle>
		);
	}
}

export default MarkdownTemplate;

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
