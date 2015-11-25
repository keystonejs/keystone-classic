'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'elemental';
import xhr from 'xhr';
import { plural } from '../utils';

import ListTile from './ListTitle';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import PrimaryNavigation from './PrimaryNavigation';

var listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

var HomeView = React.createClass({

	displayName: 'HomeView',

	getInitialState () {
		return {
			counts: {}
		};
	},

	componentDidMount () {
		this.loadCounts();
	},

	loadCounts () {
		xhr({
			url: '/keystone/api/counts'
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
			{ icon: 'tag', sections: ['tags'] }
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
			var href = list.external ? list.path : '/keystone/' + list.path;
			return <ListTile key={list.path} label={list.label} href={href} count={plural(this.state.counts[list.key], '* Item', '* Items')} />;
		});

		return <div className="dashboard-group__lists">{lists}</div>;
	},

	renderGroupedNav () {
		return (
			<div>
				{this.props.navSections.map((navSection) => {
					return (
						<div className="dashboard-group" key={navSection.key}>
							<div className="dashboard-group__heading">
								<span className={this.getHeadingIconClasses(navSection.key)} />
								{navSection.label}
							</div>
							<div className="dashboard-group__lists">
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : '/keystone/' + list.path;
									return <ListTile key={list.path} label={list.label} href={href} count={plural(this.state.counts[list.key], '* Item', '* Items')} />;
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
		return (
			<div className="dashboard-group">
				<div className="dashboard-group__heading">
					<span className="dashboard-group__heading-icon octicon octicon-database" />
					Other
				</div>
				<div className="dashboard-group__lists">
					{this.props.orphanedLists.map((list) => {
						var href = list.external ? list.path : '/keystone/' + list.path;
						return <ListTile key={list.path} label={list.label} href={href} count={plural(this.state.counts[list.key], '* Item', '* Items')} />;
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
						/>
					<PrimaryNavigation
						brand={this.props.brand}
						currentSectionKey="dashboard"
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
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
	}

});

// TODO: migrate to use reselect's createSelector
function mapStateToProps(state) {
	return {
		Keystone: state.Keystone,
		Home: state.Home
	};
}

export default connect(mapStateToProps)(HomeView);
