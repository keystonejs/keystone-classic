import React from 'react';
import theme from '../../theme';
import Link from 'gatsby-link';

import { itemsShape } from './utils';
import Item from './Item';

const welcome = {
	section: 'Welcome',
	slug: '/introduction/getting-started',
};
const guides = {
	section: 'Guides',
	slug: '/guides',
	items: [{
		label: 'Keystone Yeoman Generator',
		slug: '/yo-generator',
	}, {
		label: 'Upgrade Guide: 0.3 to 4.0',
		slug: '/v-0-3-to-v-4-0-upgrade-guide',
	}, {
		section: 'Setting Up',
		slug: '/setting-up',
		items: [{
			label: 'Part 1: Initial Setup',
			slug: '/part-1',
		}, {
			label: 'Part 2 - Database Setup',
			slug: '/part-2',
		}, {
			label: 'Part 3: Routing',
			slug: '/part-3',
		}, {
			label: 'Part 4 -  Adding data to the database from a form',
			slug: '/part-4',
		}],
	}, {
		label: 'API File and Image Uploads',
		slug: '/api-file-image-uploads',
	}, {
		label: 'How to create a blog with Keystone',
		slug: '/how-to-create-a-blog-with-keystone',
	}, {
		label: 'How to send emails with Keystone',
		slug: '/how-to-send-emails',
	}],
};
const documentation = {
	section: 'Documentation',
	slug: '/documentation',
	items: [{
		label: 'Configuration',
		slug: '/configuration',
	}, {
		section: 'Database Options',
		slug: '/database',
		items: [{
			label: 'Relationships',
			slug: '/relationships',
		}],
	}, {
		section: 'List',
		slug: '/list',
		items: [{
			label: 'Add',
			slug: '/add',
		}, {
			label: 'Model',
			slug: '/model',
		}, {
			label: 'List Construction Options',
			slug: '/options',
		}, {
			label: 'Register',
			slug: '/register',
		}, {
			label: 'Schema',
			slug: '/schema',
		}, {
			label: 'Update Item',
			slug: '/update-item',
		}],
	}, {
		section: 'Methods',
		slug: '/methods',
		items: [{
			label: 'Close Database connection',
			slug: '/close-database-connection',
		}, {
			label: 'Create Items',
			slug: '/create-items',
		}, {
			label: 'Create Router',
			slug: '/create-router',
		}, {
			label: 'Get',
			slug: '/get',
		}, {
			label: 'Import',
			slug: '/import',
		}, {
			label: 'Importer',
			slug: '/importer',
		}, {
			label: 'Init',
			slug: '/init',
		}, {
			label: 'list',
			slug: '/list',
		}, {
			label: 'Middleware',
			slug: '/middleware',
		}, {
			label: 'Open Database Connection',
			slug: '/open-database-connection',
		}, {
			label: 'Paginate',
			slug: '/paginate',
		}, {
			label: 'Pre',
			slug: '/pre',
		}, {
			label: 'Set',
			slug: '/set',
		}, {
			label: 'Start',
			slug: '/start',
		}, {
			label: 'Update Handler',
			slug: '/update-handler',
		}],
	}, {
		section: 'View',
		slug: '/view',
		items: [{
			label: 'on',
			slug: '/on',
		}, {
			label: 'query',
			slug: '/query',
		}, {
			label: 'render',
			slug: '/render',
		}],
	}, {
		section: 'Field Types',
		items: [{
			label: 'Field Options',
			slug: '/options',
		}, {
			label: 'AzureFile Field',
			slug: '/azurefile',
		}, {
			label: 'Embedly Field',
			slug: '/embedly',
		}, {
			label: 'File Field',
			slug: '/file',
		}, {
			label: 'LocalFile Field',
			slug: '/localfile',
		}, {
			label: 'Local Files',
			slug: '/localfiles',
		}, {
			label: 'S3 File Field',
			slug: '/s-3-file',
		}, {
			label: 'Boolean Field',
			slug: '/boolean',
		}, {
			label: 'CloudinaryImage Field',
			slug: '/cloudinaryimage',
		}, {
			label: 'CloudinaryImages Field',
			slug: '/cloudinaryimages',
		}, {
			label: 'Code Field',
			slug: '/code',
		}, {
			label: 'Date Field',
			slug: '/date',
		}, {
			label: 'Color Field',
			slug: '/color',
		}, {
			label: 'Datearray field',
			slug: '/datearray',
		}, {
			label: 'DateTime Field',
			slug: '/datetime',
		}, {
			label: 'Email Field',
			slug: '/email',
		}, {
			label: 'GeoPoint Field',
			slug: '/geopoint',
		}, {
			label: 'HTML Field',
			slug: '/html',
		}, {
			label: 'Key Field',
			slug: '/key',
		}, {
			label: 'Location Field',
			slug: '/location',
		}, {
			label: 'Markdown Field',
			slug: '/markdown',
		}, {
			label: 'Money Field',
			slug: '/money',
		}, {
			label: 'Name Field',
			slug: '/name',
		}, {
			label: 'Number Field',
			slug: '/number',
		}, {
			label: 'NumberArray field',
			slug: '/numberarray',
		}, {
			label: 'Password Field',
			slug: '/password',
		}, {
			label: 'Relationship Field',
			slug: '/relationship',
		}, {
			label: 'Select Field',
			slug: '/select',
		}, {
			label: 'Text Field',
			slug: '/text',
		}, {
			label: 'Textarea Field',
			slug: '/textarea',
		}, {
			label: 'Textarray Field',
			slug: '/textarray',
		}, {
			label: 'URL Field',
			slug: '/url',
		}],
	}],
};

const menu = [
	welcome,
	guides,
	documentation,
];

function makeSection (currentPath, layer, level) {
	return layer.map((section, idx) => {
		const styleChoice = level === 1 ? styles.section : styles.subsection;

		return (
			<ul key={idx} css={styles[`menu${level}`]}>
				<li css={styleChoice}><Link to={currentPath + section.slug} css={{ textDecoration: 'none', color: 'white' }}>{section.section}</Link></li>
				{section.items ? section.items.map(function (item) {
					const newPath = currentPath + section.slug;
					if (item.items) {
						return makeSection(newPath, [item], (level + 1));
					}
					return (
						<Item
							key={item.slug}
							title={item.label}
							url={newPath + item.slug}
						/>
					);
				}) : null}
			</ul>
		);
	});
}

export default function Menu ({ items }) {
	const list = makeSection('', menu, 1);

	return <nav>{list}</nav>;
};

Menu.propTypes = {
	items: itemsShape.isRequired,
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	menu1: {
		listStyle: 'none',
		margin: 0,
		paddingRight: '1em',
	},
	menu2: {
		listStyle: 'none',
		marginTop: 0,
		marginBottom: 0,
		marginLeft: '20px',
		paddingRight: '1em',
	},
	section: {
		fontSize: '1.5em',
		marginTop: '1.8em',
		opacity: 0.6,
		padding: `0 1rem`,
		textTransform: 'uppercase',
		[theme.breakpoint.largeUp]: {
			paddingLeft: `2rem`,
			paddingRight: `2rem`,
		},
		':hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
		},
	},
	subsection: {
		fontSize: '1.3em',
		opacity: 0.6,
		padding: `0 1rem`,
		marginLeft: '20px',
		textTransform: 'uppercase',
		':hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
		},
	},
};
