import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import EditIcon from 'react-icons/lib/go/pencil';

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
							<a href={editPath} css={styles.edit} target="_blank">
								<EditIcon css={styles.editIcon} />
								Edit this page
							</a>
							<div dangerouslySetInnerHTML={{ __html: body }} />
						</article>
					</Container>
				</div>
			</DocumentTitle>
		);
	}
}

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	content: {
		[theme.breakpoint.mediumUp]: {
			marginLeft: theme.sidebar.widthSmall,
			minHeight: '100vh',
		},
		[theme.breakpoint.largeUp]: {
			marginLeft: theme.sidebar.widthLarge,
		},
	},
	article: {
		paddingBottom: rhythm(1),
		paddingTop: rhythm(1),

		[theme.breakpoint.mediumUp]: {
			paddingBottom: rhythm(2),
			paddingTop: rhythm(2),
		},
	},
	edit: {
		color: theme.color.gray40,
		float: 'right',
		display: 'inline-flex',
		alignItems: 'center',
		fontSize: '0.9em',
		marginTop: rhythm(1),
		textDecoration: 'none',
		textTransform: 'uppercase',
		transition: 'color 100ms',

		':hover': {
			color: theme.color.gray60,
		},
	},
	editIcon: {
		marginRight: '0.5em',
	},
};

export default DocumentPage;
