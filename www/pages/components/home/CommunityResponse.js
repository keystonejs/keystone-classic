import React, { Component } from 'react';
import Container from '../../../components/Container';
import { Col, Row } from '../../../components/Grid';
import Link from 'gatsby-link';
import TweetEmbed from 'react-tweet-embed';

const niceTweets = [
	'844728872914616320',
	'823442524538667010',
	'804394095854624768',
	'787050130277007364',
	'764928277177917440',
	'758768387719847936',
	'757966689006858240',
	'751932694536130560',
	'751034429393530880',
	'716007045107957760',
];

export default class ValueProps extends Component {
	render () {
		return (
			<Container>
				<h2>Community Feedback</h2>
				<p>What people have been saying about KeystoneJS:</p>
				<Row small="1" medium="1/2" large="1/3">
					{niceTweets.map(tweetID => (
						<Col key={tweetID}><TweetEmbed id={tweetID} /></Col>
					))}

				</Row>
				<div>
					<Link to="/getting-started" style={{ color: 'white' }}>Get Started</Link> <a href="https://demo.keystonejs.com" style={{ color: 'white' }}>Try the Demo</a>
				</div>
			</Container>
		);
	}
};
