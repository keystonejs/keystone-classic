import React from 'react';
import { Link } from 'react-router';
import { GlyphButton } from '../../../elemental';

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
		list: React.PropTypes.object
	},
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	// directly copied from admin/client/App/screens/List/index.js
	createAutocreate () {
		const list = this.props.list;
		list.createItem(null, (err, data) => {
			if (err) {
				// TODO Proper error handling
				alert('Something went wrong, please try again!');
				console.log(err);
			} else {
				this.context.router.push(`${Keystone.adminPath}/${list.path}/${data.id}`);
			}
		});
	},
	renderCreateButton () {
		const { nocreate, autocreate, singular } = this.props.list;

		if (nocreate) return null;

		if (autocreate) {
			return (
				<Link 
					className="dashboard-group__list-create octicon octicon-plus"
					title="Create"
					tabIndex="-1"
					onClick={this.createAutocreate} />
			)
		} else {
			return (
				<Link
					to={this.props.href + '?create'}
					className="dashboard-group__list-create octicon octicon-plus"
					title="Create"
					tabIndex="-1"
				/>
			);
		}	
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
						this.renderCreateButton()
					)}
				</span>
			</div>
		);
	},
});

module.exports = ListTile;
