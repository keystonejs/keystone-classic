import React from 'react';
import { itemsShape, makeSection } from './utils';
import { documentation, guides, welcome } from './data';

const sections = [
	welcome,
	guides,
	documentation,
];

export default function Menu () {
	// let items = [];
	// sections.forEach(s => {
	// 	items.push(<h2 key={s.section}>{s.section}</h2>);
	//
	// 	s.items.forEach(i => {
	//
	// 	});
	// });
	// console.table(sections);
	return <nav>{makeSection('', sections, 1)}</nav>;
};

// return layer.map((section, idx) => {
// 	const styleChoice = level === 1 ? styles.section : styles.subsection;
//
// 	return (
// 		<ul key={idx} css={[styles.menu, styles[`menu_depth_${level}`]]}>
// 			<li css={styleChoice}>{section.section}</li>
//
// 			{section.items ? section.items.map(function (item) {
// 				const newPath = currentPath + section.slug;
//
// 				if (item.items) {
// 					return makeSection(newPath, [item], (level + 1));
// 				}
//
// 				return (
// 					<Item
// 						key={item.slug}
// 						title={item.label}
// 						url={newPath + item.slug}
// 					/>
// 				);
// 			}) : null}
// 		</ul>
// 	);
// });

Menu.propTypes = {
	items: itemsShape.isRequired,
};
