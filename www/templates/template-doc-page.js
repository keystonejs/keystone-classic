import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { presets } from 'glamor';

import { rhythm } from '../utils/typography';
import theme from '../theme';
import Container from '../components/Container';

class DocumentPage extends Component {
	render () {
		const { body, editPath, siteTitle, title } = this.props;

		return (
			<DocumentTitle title={`${title} | ${siteTitle}`}>
				<div css={styles.content}>
					<Container width="medium">
						<article css={styles.article}>
							<a href={editPath} css={styles.anchor}>Edit this Page</a>
							<div dangerouslySetInnerHTML={{ __html: body }} />
						</article>
					</Container>
				</div>
			</DocumentTitle>
		);
	}
}

const styles = {
	content: {
		[presets.Tablet]: {
			marginLeft: theme.sidebar.width,
			minHeight: '100vh',
		},
	},
	article: {
		paddingBottom: rhythm(1),
		paddingTop: rhythm(1),
	},
	anchor: {
		float: 'right',
	},
};

export default DocumentPage;
