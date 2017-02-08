import React from 'react';
import { Alert } from '../elemental';

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
		if (errors.name === 'ValidationError') {
			errors = errors.errors;
		}
		let errorCount = Object.keys(errors).length;
		let alertContent;
		let messages = Object.keys(errors).map((path) => {
			if (errorCount > 1) {
				return (
					<li key={path}>
						{upcase(errors[path].error || errors[path].message)}
					</li>
				);
			} else {
				return (
					<div key={path}>
						{upcase(errors[path].error || errors[path].message)}
					</div>
				);
			}
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

		return <Alert color="danger">{alertContent}</Alert>;
	},
	render () {
		let { error, success } = this.props.alerts;

		if (error) {
			// Render error alerts
			switch (error.error) {
				case 'validation errors':
					return this.renderValidationErrors();
				case 'error':
					if (error.detail.name === 'ValidationError') {
						return this.renderValidationErrors();
					} else {
						return <Alert color="danger">{upcase(error.error)}</Alert>;
					}
				default:
					return <Alert color="danger">{upcase(error.error)}</Alert>;
			}
		}

		if (success) {
			// Render success alerts
			return <Alert color="success">{upcase(success.success)}</Alert>;
		}

		return null; // No alerts, render nothing
	},
});

module.exports = AlertMessages;
