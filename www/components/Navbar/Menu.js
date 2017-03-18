import React, { PropTypes } from 'react';
import theme from '../../theme';

import { itemsShape } from './utils';
import Item from './Item';

export default function Menu ({ items }) {
	const list = items.map((section, idx) => {
		return (
			<ul key={idx} css={styles.menu}>
				<li css={styles.section}>{section.section}</li>
				{section.items.map(({ label, slug }) => (
					<Item
						key={slug}
						title={label}
						url={slug}
					/>
				))}
			</ul>
		);
	});

	return <nav>{list}</nav>;
};

Menu.propTypes = {
	items: itemsShape.isRequired,
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	menu: {
		listStyle: 'none',
		margin: 0,
		paddingRight: '1em',
	},
	section: {
		fontSize: '1.3em',
		marginTop: '1.8em',
		opacity: 0.6,
		padding: `0 1rem`,
		textTransform: 'uppercase',

		[theme.breakpoint.largeUp]: {
			paddingLeft: `2rem`,
			paddingRight: `2rem`,
		},
	},
};
