module.exports = {
	siteMetadata: {
		title: 'KeystoneJS',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-glamor',
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `docs`,
				path: `${__dirname}/../docs`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `fields`,
				path: `${__dirname}/../fields/types`,
			},
		},
		'gatsby-transformer-remark',
	],
};
