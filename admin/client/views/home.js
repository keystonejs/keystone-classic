'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'elemental';
import xhr from 'xhr';
import { plural } from '../utils';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import PrimaryNavigation from '../components/PrimaryNavigation';

var listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

var ListTile = React.createClass({
	propTypes: {
		count: React.PropTypes.string,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
		listkey: React.PropTypes.string
	},
	render () {
		let canCreateLists = this.props.user.roles.filter((n) => {
			return this.props.permissions[this.props.listkey].roles.create.indexOf(n) != -1;
		}).length > 0;

		let renderCreateLink = null;
		if (canCreateLists) {
			renderCreateLink = (<a href={this.props.href + '?create'}
			   className="dashboard-group__list-create octicon octicon-plus"
			   title="Create" tabIndex="-1"/>);
		}

		return (
			<div className="dashboard-group__list">
				<span className="dashboard-group__list-inner">
					<a href={this.props.href} className="dashboard-group__list-tile">
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count">{this.props.count}</div>
					</a>
					{renderCreateLink}
				</span>
			</div>
		);
	}
});

var HomeView = React.createClass({
	displayName: 'HomeView',
	getInitialState () {
		return {
			counts: {},
		};
	},
	componentDidMount () {
		this.loadCounts();
	},
	loadCounts () {
		xhr({
			url: `${Keystone.adminPath}/api/counts`
		}, (err, resp, body) => {
			try {
				body = JSON.parse(body);
			} catch(e) {
				console.log('Error parsing results json:', e, body);
				return;
			}
			if (body && body.counts) {
				if (!this.isMounted()) return;
				this.setState({
					counts: body.counts
				});
			}
		});
	},
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
		let lists = this.props.navLists.map((list) => {
			var hasListReadPermissions = this.props.user.roles.filter((n) => {
				return this.props.permissions[list.key].roles.read.indexOf(n) != -1;
			});

			if (hasListReadPermissions.length > 0) {
				var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
				return (<ListTile listkey={list.key} label={list.label} href={href}
								 count={plural(this.state.counts[list.key], '* Item', '* Items')}
								 user={this.props.user} permissions={this.props.permissions} />);
			}
		});
		return <div className="dashboard-group__lists">{lists}</div>;
	},
	renderGroupedNav () {
		return (
			<div>
				{this.props.navSections.map((navSection) => {
					let hasListReadPermissions = {};
					let hasReadPermissionsForSomeLists = false;
					{navSection.lists.map((list) => {
						hasListReadPermissions[list.key] = this.props.user.roles.filter((n) => {
								return this.props.permissions[list.key].roles.read.indexOf(n) != -1;
						}).length > 0;
						hasReadPermissionsForSomeLists = hasReadPermissionsForSomeLists ? hasReadPermissionsForSomeLists : hasListReadPermissions[list.key];
					});}
					if (!hasReadPermissionsForSomeLists) return;

					return (
						<div className="dashboard-group" key={navSection.key}>
							<div className="dashboard-group__heading">
								<span className={this.getHeadingIconClasses(navSection.key)} />
								{navSection.label}
							</div>
							<div className="dashboard-group__lists">
								{navSection.lists.map((list) => {
									if (hasListReadPermissions[list.key]) {
										var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
										return (<ListTile listkey={list.key} label={list.label} href={href}
														 count={plural(this.state.counts[list.key], '* Item', '* Items')}
														 user={this.props.user} permissions={this.props.permissions} />);
									}
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
		if (!this.props.orphanedLists.length) return;

		let hasListReadPermissions = {};
		let hasReadPermissionsForSomeList = false;
		this.props.orphanedLists.map((list) => {
			hasListReadPermissions[list.key] = this.props.user.roles.filter((n) => {
				return this.props.permissions[list.key].roles.read.indexOf(n) != -1;
			}).length > 0;
			hasReadPermissionsForSomeList = hasListReadPermissions[list.key] ? true : hasReadPermissionsForSomeList;
		});
		if (!hasReadPermissionsForSomeList) return;

		return (
			<div className="dashboard-group">
				<div className="dashboard-group__heading">
					<span className="dashboard-group__heading-icon octicon octicon-database" />
					Other
				</div>
				<div className="dashboard-group__lists">
					{this.props.orphanedLists.map((list) => {
						if (hasListReadPermissions[list.key]) {
							var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
							return (<ListTile listkey={list.key} label={list.label} href={href}
											 count={plural(this.state.counts[list.key], '* Item', '* Items')}
											 user={this.props.user} permissions={this.props.permissions} />);
						}
					})}
				</div>
			</div>
		);
	},
	render () {
		return (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={this.props.brand}
						currentSectionKey="dashboard"
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						user={this.props.user}
						permissions={this.props.permissions}
						/>
					<PrimaryNavigation
						brand={this.props.brand}
						currentSectionKey="dashboard"
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						user={this.props.user}
						permissions={this.props.permissions}
						/>
				</header>
				<div className="keystone-body">
					<Container>
						<div className="dashboard-header">
							<div className="dashboard-heading">{this.props.brand}</div>
						</div>
						<div className="dashboard-groups">
							{this.props.navIsFlat ? this.renderFlatNav() : this.renderGroupedNav()}
						</div>
					</Container>
				</div>
				<Footer
					appversion={this.props.appversion}
					backUrl={this.props.backUrl}
					brand={this.props.brand}
					User={this.props.User}
					user={this.props.user}
					version={this.props.version} />
			</div>
		);
	},
});

ReactDOM.render(
	<HomeView
		appversion={Keystone.appversion}
		backUrl={Keystone.backUrl}
		brand={Keystone.brand}
		nav={Keystone.nav}
		navIsFlat={Keystone.nav.flat}
		navLists={Keystone.lists}
		navSections={Keystone.nav.sections}
		orphanedLists={Keystone.orphanedLists}
		signoutUrl={Keystone.signoutUrl}
		User={Keystone.User}
		user={Keystone.user}
		permissions={Keystone.permissions}
		version={Keystone.version}
	/>,
	document.getElementById('home-view')
);
