import React from 'react';
import { Alert } from 'elemental';

import { upcase } from '../../utils/string';

/**
 * This renders alerts for API success and error responses.
 *   Error format: {
 *     error: 'validation errors' // The unique error type identifier
 *     detail: { ... } // Optional details specific to that error type
 *   }
 *   Success format: {
 *     success: 'item updated', // The unique success type identifier
 *     details: { ... } // Optional details specific to that success type
 *   }
 *   Eventually success and error responses should be handled individually
 *   based on their type. For example: validation errors should be displayed next
 *   to each invalid field and signin errors should promt the user to sign in.
 */
var AlertMessages = React.createClass({
	displayName: 'AlertMessages',
	propTypes: {
		alerts: React.PropTypes.shape({
			error: React.PropTypes.Object,
			success: React.PropTypes.Object,
		}),
	},
	getDefaultProps () {
		return {
			alerts: {},
		};
	},
	renderValidationErrors () {
		let errors = this.props.alerts.error.detail;
		let errorCount = Object.keys(errors).length;
		let alertContent;
		let messages = Object.keys(errors).map((path) => {
			return errorCount > 1 ? <li key={path}>{upcase(errors[path].error)}</li> : <div key={path}>{upcase(errors[path].error)}</div>;
		});

		if (errorCount > 1) {
			alertContent = (
				<div>
					<h4>There were {errorCount} errors creating the new item:</h4>
					<ul>{messages}</ul>
				</div>
			);
		} else {
			alertContent = messages;
		}

		return <Alert type="danger">{alertContent}</Alert>;
	},
	render () {
		let { error, success } = this.props.alerts;

		if (error) {
			// Render error alerts
			switch (error.error) {
				case 'validation errors':
					return this.renderValidationErrors();
				default:
					return <Alert type="danger"><h4>{upcase(error.error)}</h4></Alert>;
			}
		}

		if (success) {
			// Render success alerts
			return <Alert type="success"><h4>{upcase(success.success)}</h4></Alert>;
		}

		return null; // No alerts, render nothing
	},
});

module.exports = AlertMessages;
