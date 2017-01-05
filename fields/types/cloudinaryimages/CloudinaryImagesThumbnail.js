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

	const isVideo = value && value.resource_type === 'video' || /^data:video/.test(imageSourceSmall);

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

	function renderIcons () {
		const glyphStyles = {
			position: 'absolute',
			top: 10,
			left: 10,
			padding: 4,
			color: '#FFF',
			backgroundColor: 'rgba(0,0,0,0.5)',
			pointerEvents: 'none',
		};

		if (isVideo) {
			return <i style={glyphStyles} className="octicon octicon-device-camera-video" />;
		}
	}

	function renderPreview () {
		if (isVideo && isQueued) {
			return <video src={imageSourceSmall} height={90}>NO PREVIEW</video>;
		} else {
			// Force JPG thumbnail for videos, else would return the actual video
			return <img src={imageSourceSmall + (isVideo ? '.jpg' : '')} style={{ height: 90 }}/>;
		}
	}

	// provide gutter for the images
	const imageStyles = {
		float: 'left',
		position: 'relative',
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
			{renderIcons()}
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
