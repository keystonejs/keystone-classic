import React from 'react';
import { Link } from 'react-router';
import { GlyphButton, FormInput } from '../../../elemental';

const RevisionHeader = ({
	id,
	title,
	routeParams,
	currentList,
	currentItem,
}) => {
	const renderBack = () => {
		const backPath = `${Keystone.adminPath}/${routeParams.listId}/${id}`;
		return (
			<GlyphButton
				component={Link}
				data-e2e-editform-header-back
				glyph="chevron-left"
				position="left"
				to={backPath}
				variant="link"
			>
				Back
			</GlyphButton>
		);
	};

	return (
		<div style={styles.container}>
			<span>{renderBack()}</span>
			<FormInput noedit style={styles.title}>
				Revisions for {title} ({id})
			</FormInput>
		</div>
	);
};

const styles = {
	container: {
		borderBottom: '1px dashed #e1e1e1',
		margin: 'auto',
		paddingBottom: '1em',
	},
	title: {
		fontSize: '1.3rem',
	},
};

export default RevisionHeader;
