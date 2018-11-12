import React from 'react';
import Link from 'gatsby-link';
import Item from '../Item';

export default function makeSection (currentPath, layer, pathname) {
	return layer.map((section, idx) => {
		const locationArray = pathname.split('/');
		const currentSection = locationArray[locationArray.length - 1];

		const menuItems = section.items.map((item, i) => {
			const newPath = currentPath + section.slug;

			// Secondary items
			if (item.items) {
				const subItems = item.items.map((subItem, sid) => (
					<Item
						isActive={currentSection === subItem.slug.split('/')[1] || (!subItem.slug && currentSection === item.slug.split('/')[1])}
						key={subItem.slug + '__' + sid}
						title={subItem.label}
						url={newPath + item.slug + subItem.slug}
						depth={2}
					/>
				));
				return (
					<div>
						<Item
							url={newPath + item.slug + item.items[0].slug}
							title={item.section}
							depth={1}
							isExpandable
						/>
						{locationArray[2] === item.slug.split('/')[1] && subItems}
					</div>
				);
			}

			// Primary items
			return (
				<Item
					isActive={
						locationArray.length === 2
							? !item.slug
							: currentSection === item.slug.split('/')[1]
					}
					key={item.slug + '__' + i}
					title={item.label}
					url={newPath + item.slug}
					depth={1}
				/>
			);
		});

		// Sections
		return (
			<div key={'section__' + idx}>
				<Link to={section.slug} css={styles.sectionTitle}>
					{section.section}
				</Link>
				{locationArray[1] === section.slug.split('/')[1] && menuItems}
			</div>
		);
	});
}

const styles = {
	sectionTitle: {
		display: 'block',
		color: 'white',
		fontSize: '1rem',
		textTransform: 'uppercase',
		fontWeight: '600',
		textDecoration: 'none',
		padding: '0.625rem 1.875rem',
	},
};
