import React from 'react';
import { Alert } from 'elemental';

var FlashMessage = React.createClass({
	displayName: 'FlashMessage',

	propTypes: {
		message: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string,
		]),
		type: React.PropTypes.string,
	},

	renderMessage (message) {
		if (typeof message === 'string') return <span>{message}</span>;

		let title = message.title ? <h4>{message.title}</h4> : null;
		let detail = message.detail ? <p>{message.detail}</p> : null;
		let list = message.list ? (
			<ul style={{ marginBottom: 0 }}>
				{message.list.map(item => <li>{item}</li>)}
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
	}

});

var FlashMessages = React.createClass({
	displayName: 'FlashMessages',
	propTypes: {
		messages: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.shape({
				error: React.PropTypes.array,
				hilight: React.PropTypes.array,
				info: React.PropTypes.array,
				success: React.PropTypes.array,
				warning: React.PropTypes.array,
			})
		]),
	},

	renderMessages (messages, type) {
		if (!messages || !messages.length) return null;

		return messages.map((message) => {
			return <FlashMessage message={message} type={type} />;
		});
	},

	renderTypes (types) {
		return Object.keys(types).map(type => this.renderMessages(types[type], type));
	},

	render () {
		if (!this.props.messages) return null;

		return (
			<div className="flash-messages">
				{this.renderTypes(this.props.messages)}
			</div>
		);
	}

});

module.exports = FlashMessages;
