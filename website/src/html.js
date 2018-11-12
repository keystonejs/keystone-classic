import React from 'react';

let stylesStr;
if (process.env.NODE_ENV === 'production') {
	try {
		stylesStr = require('!raw-loader!../public/styles.css');
	} catch (e) {
		console.log(e);
	}
}

module.exports = class HTML extends React.Component {
	render () {
		let css;
		if (process.env.NODE_ENV === 'production') {
			css = (
				<style
					id="gatsby-inlined-css"
					dangerouslySetInnerHTML={{ __html: stylesStr }}
				/>
			);
		}
		return (
			<html {...this.props.htmlAttributes}>
				<head>
					<meta charSet="utf-8" />
					<meta httpEquiv="x-ua-compatible" content="ie=edge" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no"
					/>
					<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<script async src="https://www.googletagmanager.com/gtag/js?id=UA-43970386-1"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'UA-43970386-1');`,
						}}
					/>
					{this.props.headComponents}
					{css}
				</head>
				<body {...this.props.bodyAttributes}>
					{this.props.preBodyComponents}
					<div
						key={'body'}
						id="___gatsby"
						dangerouslySetInnerHTML={{ __html: this.props.body }}
					/>
					{this.props.postBodyComponents}
				</body>
			</html>
		);
	}
};
