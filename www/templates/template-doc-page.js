import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { presets } from 'glamor';
import { rhythm } from '../utils/typography';

class DocumentPage extends Component {
	render () {
		const { body, editPath, siteTitle, title } = this.props;

		return (
			<DocumentTitle title={`${title} | ${siteTitle}`}>
				<section css={styles.section}>
					<h1 css={{ marginTop: 0 }}>{title}</h1>
					<a href={editPath} css={styles.anchor}>Edit this Page</a>
					<div dangerouslySetInnerHTML={{ __html: body }} />
				</section>
			</DocumentTitle>
		);
	}
}

const styles = {
	section: {
		maxWidth: '100%',
		paddingBottom: rhythm(1 / 2),
		[presets.Tablet]: {
			paddingTop: 0,
		},
	},
	anchor: {
		display: 'block',
		marginBottom: rhythm(1),
	},
};

export default DocumentPage;
