import React from 'react';
import { Link } from 'react-router';

/**
 * Displays information about a list and lets you create a new one.
 */
var ListTile = React.createClass({
	propTypes: {
		count: React.PropTypes.string,
		hideCreateButton: React.PropTypes.bool,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
		path: React.PropTypes.string,
		spinner: React.PropTypes.object,
	},
	render () {
		var opts = {
			'data-list-path': this.props.path,
		};
		return (
			<div className="dashboard-group__list" {...opts}>
				<span className="dashboard-group__list-inner">
					<Link to={this.props.href} className="dashboard-group__list-tile">
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count">{this.props.spinner || this.props.count}</div>
					</Link>
					{/* If we want to create a new list, we append ?create, which opens the
						create form on the new page! */}
					{(!this.props.hideCreateButton) && (
						<Link
							to={this.props.href + '?create'}
							className="dashboard-group__list-create octicon octicon-plus"
							title="Create"
							tabIndex="-1"
						/>
					)}
				</span>
			</div>
		);
	},
});

module.exports = ListTile;
