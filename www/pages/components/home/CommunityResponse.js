import React, { Component } from 'react';
import Container from '../../../components/Container';
import { Col, Row } from '../../../components/Grid';
import Link from 'gatsby-link';
import TweetEmbed from 'react-tweet-embed';

export default class ValueProps extends Component {
	render () {
		return (
			<Container>
				<h2>Community Feedback</h2>
				<p>What people have been saying about KeystoneJS:</p>
				<Row small="1" medium="1/2" large="1/3">
					<Col><TweetEmbed id="844728872914616320" /></Col>
					<Col><TweetEmbed id="836198982179237888" /></Col>
					<Col><TweetEmbed id="823442524538667010" /></Col>
					<Col><TweetEmbed id="804394095854624768" /></Col>
					<Col><TweetEmbed id="787050130277007364" /></Col>
					<Col><TweetEmbed id="764928277177917440" /></Col>
					<Col><TweetEmbed id="758768387719847936" /></Col>
					<Col><TweetEmbed id="757966689006858240" /></Col>
					<Col><TweetEmbed id="751932694536130560" /></Col>
					<Col><TweetEmbed id="751034429393530880" /></Col>
					<Col><TweetEmbed id="716007045107957760" /></Col>
				</Row>
				<div>
					<Link to="" style={{ color: 'white' }}>Get Started</Link> <Link to="" style={{ color: 'white' }}>Try the Demo</Link>
				</div>
			</Container>
		);
	}
};
