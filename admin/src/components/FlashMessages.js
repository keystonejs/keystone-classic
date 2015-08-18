const React = require('react');
const blacklist = require('blacklist');
const { Alert } = require('elemental');

var FlashMessage = React.createClass({
	displayName: 'FlashMessage',

	propTypes: {
		message: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string,
		]),
		type: React.PropTypes.string,
	},

	renderMessage () {
		let { message } = this.props;

		if (typeof message === 'string') {
			return <span>{message}</span>;
		}

		let title = message.title ? <h4>{message.title}</h4> : null;
		let detail = message.detail ? <p>{message.detail}</p> : null;
		let list = message.list ? (
			<ul>
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
		// sanitize types
		let type = (this.props.type === 'error') ? 'danger' : this.props.type;

		return <Alert type={type}>{this.renderMessage()}</Alert>;
	}

});

var FlashMessages = React.createClass({
	displayName: 'FlashMessages',
	propTypes: {
		messages: React.PropTypes.shape({
			error: React.PropTypes.array,
			hilight: React.PropTypes.array,
			info: React.PropTypes.array,
			success: React.PropTypes.array,
			warning: React.PropTypes.array,
		})
	},

	renderErrorAlerts () {
		// TODO: @JM was this implemented?
		return null;
	},

	render () {
		return (
			<div className="flash-messages">
				{this.renderErrorAlerts()}
			</div>
		);
	}

});

module.exports = FlashMessages;
