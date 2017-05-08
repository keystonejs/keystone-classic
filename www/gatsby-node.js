const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');

exports.createPages = ({ graphql, boundActionCreators }) => {
	const { upsertPage } = boundActionCreators;
	return new Promise((resolve, reject) => {
		const articleComponent = path.resolve(
      './src/templates/template-doc-layout.js'
    );
		resolve(
      graphql(
        `{
				allMarkdownRemark(limit: 1000) {
					edges {
						node {
							slug
						}
					}
				}
			}
		`
      ).then(result => {
	if (result.errors) {
		console.error(result.errors);
		reject(result.errors);
	}

        // Create article routes.
	result.data.allMarkdownRemark.edges.forEach(edge => {
		upsertPage({
			path: edge.node.slug, // required
			component: articleComponent,
			context: {
				slug: edge.node.slug,
			},
		});
	});
})
    );
	});
};

function kebabify (string) {
	return string.split('/').map(s => _.kebabCase(s)).join('/');
}

// Add custom slug.
exports.onNodeCreate = ({ node, boundActionCreators, getNode }) => {
	const { updateNode } = boundActionCreators;

	if (node.type === `MarkdownRemark`) {
		const file = getNode(node.parent);
		const parsedFilePath = path.parse(file.relativePath);
		let section = parsedFilePath.dir;
		let slug;

		if (
      parsedFilePath.name.match(/Readme/i)
      && file.dir.match(/\/fields\/types\//)
    ) {
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

		node.slug = slug;
		file.slug = slug;
		section = _.startCase(section);

		node.section = section;
		file.section = section;

		updateNode(node);
		updateNode(file);
	}
};
