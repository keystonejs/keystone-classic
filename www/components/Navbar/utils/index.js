import { PropTypes } from 'react';
import makeSection from './makeSection';

const itemsShape = PropTypes.arrayOf(PropTypes.shape({
	section: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		slug: PropTypes.string,
	})),
}));

export default {
	itemsShape,
	makeSection,
};
