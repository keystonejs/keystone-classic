module.exports = {
	siteMetadata: {
		title: 'KeystoneJS',
	},
	plugins: [
		`gatsby-plugin-glamor`,
		`gatsby-plugin-sharp`,
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
		`gatsby-parser-remark`,
		`gatsby-parser-sharp`,
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
							offsetY: -46,
						},
					},
				],
			},
		},
		`gatsby-typegen-filesystem`,
		`gatsby-typegen-sharp`,
	],
};
