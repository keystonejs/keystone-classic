/**
 * The Home view is the view one sees at /keystone. It shows a list of all lists,
 * grouped by their section.
 */

import React from 'react';
import { Container, Spinner } from 'elemental';
import { connect } from 'react-redux';

import { plural } from '../../../utils/string';
import ListTile from './components/ListTile';
import AlertMessages from '../../shared/AlertMessages';
import {
	loadCounts,
} from './actions';

var HomeView = React.createClass({
	displayName: 'HomeView',
	// When everything is rendered, start loading the item counts of the lists
	// from the API
	componentDidMount () {
		this.props.dispatch(loadCounts());
	},
	// Certain section name have an icon associated with the for a nicer view
	getHeadingIconClasses (navSectionKey) {
		const icons = [
			{ icon: 'book', sections: ['books', 'posts', 'blog', 'blog-posts', 'stories', 'news-stories', 'content'] },
			{ icon: 'briefcase', sections: ['businesses', 'companies', 'listings', 'organizations', 'partners'] },
			{ icon: 'calendar', sections: ['events', 'dates'] },
			{ icon: 'clock', sections: ['classes', 'hours', 'times'] },
			{ icon: 'file-media', sections: ['gallery', 'galleries', 'images', 'photos', 'pictures'] },
			{ icon: 'file-text', sections: ['attachments', 'docs', 'documents', 'files'] },
			{ icon: 'location', sections: ['locations', 'markers', 'places'] },
			{ icon: 'mail', sections: ['emails', 'enquiries'] },
			{ icon: 'megaphone', sections: ['broadcasts', 'jobs', 'talks'] },
			{ icon: 'organization', sections: ['contacts', 'customers', 'groups', 'members', 'people', 'speakers', 'teams', 'users'] },
			{ icon: 'package', sections: ['boxes', 'items', 'packages', 'parcels'] },
			{ icon: 'tag', sections: ['tags'] },
		];
		const classes = icons
			.filter(obj => obj.sections.indexOf(navSectionKey) !== -1)
			.map(obj => `octicon-${obj.icon}`);

		if (!classes.length) {
			classes.push('octicon-primitive-dot');
		}

		return ['dashboard-group__heading-icon', 'octicon', ...classes].join(' ');
	},
	renderFlatNav () {
		const lists = Keystone.lists.map((list) => {
			var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
			return (
				<ListTile
					key={list.path}
					path={list.path}
					label={list.label}
					href={href}
					count={this.getCount(list.key)}
				/>
			);
		});
		return <div className="dashboard-group__lists">{lists}</div>;
	},
	getCount (key) {
		// If we have previous counts already saved, show them while we fetch
		// the new ones. The counts can change e.g. if items were created since
		// the last visit to the homepage
		if (Object.keys(this.props.counts).length === 0
			&& (this.props.error || this.props.loading)) {
			return (
				<Spinner />
			);
		}
		return plural(this.props.counts[key], '* Item', '* Items');
	},
	renderGroupedNav () {
		return (
			<div>
				{Keystone.nav.sections.map((navSection) => {
					return (
						<div className="dashboard-group" key={navSection.key} data-section-label={navSection.label}>
							<div className="dashboard-group__heading">
								<span className={this.getHeadingIconClasses(navSection.key)} />
								{navSection.label}
							</div>
							<div className="dashboard-group__lists">
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
									return (
										<ListTile
											key={list.path}
											path={list.path}
											label={list.label}
											href={href}
											count={this.getCount(list.key)}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
				{this.renderOrphanedLists()}
			</div>
		);
	},
	renderOrphanedLists () {
		if (!Keystone.orphanedLists.length) return;
		let sectionLabel = 'Other';
		return (
			<div className="dashboard-group" data-section-label={sectionLabel}>
				<div className="dashboard-group__heading">
					<span className="dashboard-group__heading-icon octicon octicon-database" />
					{sectionLabel}
				</div>
				<div className="dashboard-group__lists">
					{Keystone.orphanedLists.map((list) => {
						var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
						return (
							<ListTile
								key={list.path}
								path={list.path}
								label={list.label}
								href={href}
								count={this.getCount(list.key)}
							/>
						);
					})}
				</div>
			</div>
		);
	},
	render () {
		return (
			<Container data-screen-id="home">
				<div className="dashboard-header">
					<div className="dashboard-heading">{Keystone.brand}</div>
				</div>
				<div className="dashboard-groups">
					{(this.props.error) ? (
						<AlertMessages
							alerts={{ error: { error:
								"There is a problem with the network, we're trying to reconnect...",
							} }}
						/>
					) : null}
					{Keystone.nav.flat ? this.renderFlatNav() : this.renderGroupedNav()}
				</div>
			</Container>
		);
	},
});

module.exports = connect((state) => ({
	counts: state.home.counts,
	loading: state.home.loading,
	error: state.home.error,
}))(HomeView);
