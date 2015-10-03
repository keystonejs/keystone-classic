import React from 'react';
// import CloudinaryImage from 'react-cloudinary-img';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

const linkStyle = {
	marginRight: 8,
};
const boxStyle = {
	borderRadius: 3,
	display: 'inline-block',
	height: 18,
	overflow: 'hidden',
	verticalAlign: 'middle',
	width: 18,
};
const imageStyle = {
	display: 'block',
	height: 18,
	left: '50%',
	position: 'relative',

	WebkitTransform: 'translateX(-50%)',
	MozTransform:    'translateX(-50%)',
	msTransform:     'translateX(-50%)',
	transform:       'translateX(-50%)',
};
const textStyle = {
	color: '#888',
	display: 'inline-block',
	fontSize: '.8rem',
	marginLeft: 8,
	verticalAlign: 'middle'
};

var CloudinaryImageSummary = React.createClass({
	displayName: 'CloudinaryImageSummary',
	propTypes: {
		label: React.PropTypes.oneOf(['dimensions', 'publicId']),
		image: React.PropTypes.object.isRequired,
	},
	renderLabel () {
		if (!this.props.label) return;

		let { label, image } = this.props;

		let text;
		if (label === 'dimensions') {
			text = `${image.width} × ${image.height}`;
		} else {
			text = `${image.public_id}.${image.format}`;
		}

		return (
			<span style={textStyle}>
				{text}
			</span>
		);
	},
	render () {
		let { image } = this.props;

		return (
			<span style={linkStyle}>
				<span style={boxStyle}>
					<img src={image.url} style={imageStyle} />
				</span>
				{this.renderLabel()}
			</span>
		);
	}
});

module.exports = CloudinaryImageSummary;
