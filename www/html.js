import React from 'react';
import { GoogleFont, TypographyStyle } from 'react-typography';
import typography from './utils/typography';

let stylesStr;
if (process.env.NODE_ENV === `production`) {
	try {
		stylesStr = require(`!raw-loader!./public/styles.css`);
	} catch (e) {
		console.log(e);
	}
}

module.exports = React.createClass({
	render () {
		// TODO add react helmet rewind
		let css;
		if (process.env.NODE_ENV === `production`) {
			css = <style id="gatsby-inlined-css" dangerouslySetInnerHTML={{ __html: stylesStr }} />;
		}
		return (
			<html lang="en">
				<head>
					<title>Keystonejs</title>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					{this.props.headComponents}
					<GoogleFont typography={typography} />
					<TypographyStyle typography={typography} />
					{css}
				</head>
				<body>
					<div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
					{this.props.postBodyComponents}
				</body>
			</html>
		);
	},
});
