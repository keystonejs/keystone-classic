module.exports = {
	siteMetadata: {
		title: 'KeystoneJS',
	},
	plugins: [
		`gatsby-parser-remark`,
		`gatsby-plugin-glamor`,
		`gatsby-plugin-offline`,
		`gatsby-plugin-sharp`,
		`gatsby-typegen-filesystem`,
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: `UA-53647600-7`,
			},
		},
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
		{
			resolve: `gatsby-typegen-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-typegen-remark-responsive-image`,
						options: {
							maxWidth: 800,
							wrapperStyle: `margin-bottom: 1.125rem;`,
						},
					},
					{
						resolve: `gatsby-typegen-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin-bottom: 1.125rem;`,
						},
					},
					`gatsby-typegen-remark-copy-linked-files`,
					`gatsby-typegen-remark-smartypants`,
					`gatsby-typegen-remark-prismjs`,
					{
						resolve: `gatsby-typegen-remark-autolink-headers`,
						options: {
							offsetY: 0,
						},
					},
				],
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `KeystoneJS`,
				short_name: `KeystoneJS`,
				start_url: `/`,
				background_color: `white`,
				theme_color: `#056EA1`,
				display: `minimal-ui`,
			},
		},
	],
};
