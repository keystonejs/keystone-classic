import { PropTypes } from 'react';

export const itemsShape = PropTypes.arrayOf(PropTypes.shape({
	section: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		slug: PropTypes.string,
	})),
}));
