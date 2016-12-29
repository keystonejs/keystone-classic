import React, { PropTypes } from 'react';
import { Button } from '../../../admin/client/App/elemental';
import ImageThumbnail from '../../components/ImageThumbnail';

function CloudinaryImagesThumbnail ({
	isDeleted,
	imageSourceLarge,
	imageSourceSmall,
	inputName,
	isQueued,
	openLightbox,
	shouldRenderActionButton,
	toggleDelete,
	value,
	...props
}) {
	// render icon feedback for intent
	let mask;
	if (isQueued) mask = 'upload';
	else if (isDeleted) mask = 'remove';

	// action button
	const actionButton = (shouldRenderActionButton && !isQueued) ? (
		<Button variant="link" color={isDeleted ? 'default' : 'cancel'} block onClick={toggleDelete}>
			{isDeleted ? 'Undo' : 'Remove'}
		</Button>
	) : null;

	function renderInput () {
		if (!isQueued && value) {
			if (isDeleted) value.remove = true;
			return (
				<input type="hidden" name={inputName} value={JSON.stringify(value)} />
			);
		} else {
			return null;
		}
	}

	function renderPreview () {
		if (/^data:video/.test(imageSourceSmall)) {
			return <video src={imageSourceSmall} height={90}>NO PREVIEW</video>;
		} else {
			return <img src={imageSourceSmall} style={{ height: 90 }} />;
		}
	}

	// provide gutter for the images
	const imageStyles = {
		float: 'left',
		marginBottom: 10,
		marginRight: 10,
	};

	return (
		<div style={imageStyles}>
			<ImageThumbnail
				component={imageSourceLarge ? 'a' : 'span'}
				href={!!imageSourceLarge && imageSourceLarge}
				onClick={!!imageSourceLarge && openLightbox}
				mask={mask}
				target={!!imageSourceLarge && '__blank'}
			>
				{renderPreview()}
			</ImageThumbnail>
			{actionButton}
			{renderInput()}
		</div>
	);

};

CloudinaryImagesThumbnail.propTypes = {
	imageSourceLarge: PropTypes.string,
	imageSourceSmall: PropTypes.string.isRequired,
	isDeleted: PropTypes.bool,
	isQueued: PropTypes.bool,
	openLightbox: PropTypes.func.isRequired,
	shouldRenderActionButton: PropTypes.bool,
	toggleDelete: PropTypes.func.isRequired,
};

module.exports = CloudinaryImagesThumbnail;
