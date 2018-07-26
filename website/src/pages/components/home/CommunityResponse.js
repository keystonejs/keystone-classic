import React, { Component } from 'react';
import { compose } from 'glamor';
import Container from '../../../../components/Container';
import TwitterButton from '../../../../components/TwitterButton';
import { Col, Row } from '../../../../components/Grid';
import { color } from '../../../../theme';
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

export default class CommunityResponse extends Component {
	render () {
		return (
			<div className={compose(styles.wrap)}>
				<Container>
					<h2 className={compose(styles.heading)}>Community Feedback</h2>
					<p className={compose(styles.subheading)}>
						What people have been saying about KeystoneJS:
					</p>
					<TwitterButton href="https://twitter.com/keystonejs" />
					<div className={compose(styles.tweets)}>
						<Row small="1" medium="1/2" large="1/3">
							{niceTweets.map(tweetID => (
								<Col key={tweetID}>
									<TweetEmbed id={tweetID} />
								</Col>
							))}
						</Row>
					</div>
				</Container>
			</div>
		);
	}
}

const styles = {
	wrap: {
		padding: '4rem 0',
		textAlign: 'center',
	},
	heading: {
		fontSize: '2rem',
	},
	subheading: {
		fontSize: '1.25rem',
		color: color.gray50,
	},
	tweets: {
		marginTop: '2rem',
	},
};
