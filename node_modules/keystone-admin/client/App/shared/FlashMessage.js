/**
 * A single flash message component. Used by FlashMessages.js
 */

import React from 'react';
import { Alert } from 'elemental';

const FlashMessage = React.createClass({
	propTypes: {
		message: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string,
		]),
		type: React.PropTypes.string,
	},
	// Render the message
	renderMessage (message) {
		// If the message is only a string, render the string
		if (typeof message === 'string') {
			return (
				<span>
					{message}
				</span>
			);
		}

		// Get the title and the detail of the message
		const title = message.title ? <h4>{message.title}</h4> : null;
		const detail = message.detail ? <p>{message.detail}</p> : null;
		// If the message has a list attached, render a <ul>
		const list = message.list ? (
			<ul style={{ marginBottom: 0 }}>
				{message.list.map((item, i) => <li key={`i${i}`}>{item}</li>)}
			</ul>
		) : null;

		return (
			<span>
				{title}
				{detail}
				{list}
			</span>
		);
	},
	render () {
		return <Alert type={this.props.type}>{this.renderMessage(this.props.message)}</Alert>;
	},
});

module.exports = FlashMessage;
