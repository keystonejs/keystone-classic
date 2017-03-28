import React from 'react';
import Item from '../Item';

export default function makeSection (currentPath, layer, depth) {
	return layer.map((section, idx) => {
		const sectionStyles = depth === 1 ? styles.section : styles.subsection;

		return (
			<ul key={idx} css={[styles.menu, styles[`menu_depth_${depth}`]]}>
				<li css={sectionStyles}>{section.section}</li>

				{section.items ? section.items.map(function (item) {
					const newPath = currentPath + section.slug;

					if (item.items) {
						return makeSection(newPath, [item], (depth + 1));
					}

					return (
						<Item
							depth={depth}
							key={item.slug}
							title={item.label}
							url={newPath + item.slug}
						/>
					);
				}) : null}
			</ul>
		);
	});
};

const styles = {
	menu: {
		listStyle: 'none',
		margin: 0,
		// paddingRight: '1em',
	},
	menu_depth_1: {},
	menu_depth_2: {},

	section: {
		fontSize: '1.7em',
		margin: '1.8em 0 0.5em',
		opacity: 0.6,
		padding: `0 1rem`,
		textTransform: 'uppercase',
	},
	subsection: {
		fontSize: '1.3em',
		margin: '1em 0 0.2em',
		opacity: 0.6,
		padding: `0 1rem 0 2rem`,
		textTransform: 'uppercase',
	},
};
