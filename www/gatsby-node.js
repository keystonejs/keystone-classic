const _ = require('lodash');
const path = require('path');
const select = require('unist-util-select');
const Promise = require('bluebird');

exports.createPages = ({ args }) => {
	const { graphql } = args;

	return new Promise((resolve, reject) => {
		const paths = [];
		graphql(`
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `)
    .then((result) => {
	if (result.errors) {
		console.log(result.errors);
		reject(result.errors);
	}

	const articleComponent = path.resolve('./pages/template-doc-page.js');
      // Create article routes.
	_.each(result.data.allMarkdownRemark.edges, (edge) => {
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

// Add custom slug.
exports.modifyAST = ({ args }) => {
	console.time(`local modifyAST`);
	const { ast } = args;
	const files = select(ast, `File[extension="md"]`);
	files.forEach((file) => {
		const parsedFilePath = path.parse(file.relativePath);
		let slug;
		if (parsedFilePath.name === `index`) {
			slug = `/${_.kebabCase(parsedFilePath.dir)}/`;
		} else if (parsedFilePath.name.match(/Readme/i) && file.dir.match(/\/fields\/types\//)) {
			slug = `/field/${_.kebabCase(parsedFilePath.dir)}/`;
		} else {
			slug = `/${_.kebabCase(parsedFilePath.dir)}/${_.kebabCase(parsedFilePath.name)}/`;
		}

		// If file isn't in subdirectory "dir" will be empty.
		slug = slug.replace('//', '/');

		file.children[0].slug = slug;

		file.slug = slug;
	});
	console.timeEnd(`local modifyAST`);
	return files;
};
