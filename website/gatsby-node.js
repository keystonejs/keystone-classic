/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const kebabCase = require('lodash.kebabcase');
const path = require('path');

exports.onCreateNode = (
	{ node, boundActionCreators, getNode } /* : NodeParams */
) => {
	const { createNodeField } = boundActionCreators;


	if (node.internal.type === 'MarkdownRemark') {
		const fileNode = getNode(node.parent);

		const parsedFilePath = path.parse(fileNode.relativePath);
		let section = parsedFilePath.dir;
		let slug;

		if (
			parsedFilePath.name.match(/Readme/i)
			&& fileNode.dir.match(/\/fields\/types\//)
		) {
			section = 'api/field'; // fake the path for slug consistency
			slug = `/${section}/${kebabify(parsedFilePath.dir)}`;
		} else {
			if (parsedFilePath.name === 'index') {
				slug = `/${kebabify(parsedFilePath.dir)}`;
			} else {
				slug = `/${kebabify(parsedFilePath.dir)}/${kebabify(
					parsedFilePath.name
				)}`;
			}
		}
		// If file isn't in subdirectory "dir" will be empty.
		slug = slug.replace('//', '/');

		createNodeField({ node, name: 'slug', value: slug });
		createNodeField({ node, name: 'section', value: section });
	}
};

exports.createPages = (
	{ graphql, boundActionCreators } /* : NodeParams */
) /* : Promise<any> */ => {
	const { createPage } = boundActionCreators;

	return new Promise((resolve, reject) => {
		const articleComponent = path.resolve('templates/template-doc-layout.js');
		resolve(
			graphql(
				`
					{
						allMarkdownRemark(limit: 1000) {
							edges {
								node {
									fields {
										slug
									}
								}
							}
						}
					}
				`
			).then(result => {
				if (result.errors) {
					/* eslint-disable-next-line no-console */
					console.log(result.errors);
					reject(result.errors);
				}

				result.data.allMarkdownRemark.edges.forEach(edge => {
					createPage({
						path: edge.node.fields.slug, // required
						component: articleComponent,
						context: {
							slug: edge.node.fields.slug,
						},
					});
				});
			})
		);
	});
};

function kebabify (string) {
	return string
		.split('/')
		.map(s => kebabCase(s))
		.join('/');
}
