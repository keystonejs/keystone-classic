import React, { PropTypes } from 'react';

export default function Brand ({ fill }) {
	return (
		<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 101.4" enableBackground="new 0 0 100 101.4" xmlSpace="preserve">
			<g>
				<path fill={fill} d="M95.6,0H4.4C2,0,0,2,0,4.5v92.5c0,2.5,2,4.5,4.4,4.5h91.2c2.4,0,4.4-2,4.4-4.5V4.5C100,2,98,0,95.6,0z M63.8,86.8L42.4,57.8l-5.5,6.7v22.3H22.3v-72h14.5v32.2l25-32.2h18.5L52.3,48.5l30,38.3H63.8z"/>
			</g>
		</svg>
	);
};

Brand.propTypes = {
	fill: PropTypes.string,
};
Brand.defaultProps = {
	fill: '#FFFFFF',
};
