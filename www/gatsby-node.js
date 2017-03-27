const _ = require('lodash');
const path = require('path');
const select = require('unist-util-select');
const Promise = require('bluebird');

exports.createPages = ({ args }) => {
	const { graphql } = args;

	return new Promise((resolve, reject) => {
		const paths = [];
		const articleComponent = path.resolve('templates/template-doc-layout.js');
		graphql(`{
				allMarkdownRemark(limit: 1000) {
					edges {
						node {
							slug
						}
					}
				}
			}
		`).then((result) => {
			if (result.errors) {
				console.error(result.errors);
				reject(result.errors);
			}

			// Create article routes.
			result.data.allMarkdownRemark.edges.forEach((edge) => {
				paths.push({
					path: edge.node.slug, // required
					component: articleComponent,
					context: {
						slug: edge.node.slug,
					},
				});
			});

			resolve(paths);
		});
	});
};

function kebabify (string) {
	return string.split('/').map(s => _.kebabCase(s)).join('/');
}

// Add custom slug.
exports.modifyAST = ({ args }) => {
	console.time(`local modifyAST`);
	const { ast } = args;
	const files = select(ast, `File[extension="md"]`);
	files.forEach((file) => {
		const parsedFilePath = path.parse(file.relativePath);
		let section = parsedFilePath.dir;
		let slug;

		if (parsedFilePath.name.match(/Readme/i) && file.dir.match(/\/fields\/types\//)) {
			section = 'api/field'; // fake the path for slug consistency
			slug = `/${section}/${kebabify(parsedFilePath.dir)}`;
		} else {
			if (parsedFilePath.name === 'index') {
				slug = `/${kebabify(parsedFilePath.dir)}`;
			} else {
				slug = `/${kebabify(parsedFilePath.dir)}/${kebabify(parsedFilePath.name)}`;
			}
		}

		// If file isn't in subdirectory "dir" will be empty.
		slug = slug.replace('//', '/');

		file.children[0].slug = slug;
		file.slug = slug;

		section = _.startCase(section);
		file.children[0].section = section;
		file.section = section;
	});
	console.timeEnd(`local modifyAST`);
	return files;
};
