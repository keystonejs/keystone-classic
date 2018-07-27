module.exports = {
	siteMetadata: {
		title: 'KeystoneJS',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-glamor',
		'gatsby-transformer-remark',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'docs',
				path: `${__dirname}/../docs`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'fields',
				path: `${__dirname}/../fields/types`,
			},
		},
		{
			resolve: 'gatsby-plugin-typography',
			options: {
				pathToConfigModule: 'utils/typography',
			},
		},
		'gatsby-plugin-netlify',
	],
};
