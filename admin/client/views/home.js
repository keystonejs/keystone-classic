const React = require('react');
const ReactDOM = require('react-dom');
const { Container } = require('elemental');
const xhr = require('xhr');
const { plural } = require('../utils');
const Footer = require('../components/Footer');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');

const ICON_TAGS_BOOK = ['books', 'posts', 'blog', 'blog-posts', 'stories', 'news-stories', 'content'];
const ICON_TAGS_BRIEFCASE = ['businesses', 'companies', 'listings', 'organizations', 'partners'];
const ICON_TAGS_CALENDAR = ['events', 'dates'];
const ICON_TAGS_CLOCK = ['classes', 'hours', 'times'];
const ICON_TAGS_FILE_MEDIA = ['gallery', 'galleries', 'images', 'photos', 'pictures'];
const ICON_TAGS_FILE_TEXT = ['attachments', 'docs', 'documents', 'files'];
const ICON_TAGS_LOCATION = ['locations', 'markers', 'places'];
const ICON_TAGS_MAIL = ['emails', 'enquiries'];
const ICON_TAGS_MEGAPHONE = ['broadcasts', 'jobs', 'talks'];
const ICON_TAGS_ORGANIZATION = ['contacts', 'customers', 'groups', 'members', 'people', 'speakers', 'teams', 'users'];
const ICON_TAGS_PACKAGE = ['boxes', 'items', 'packages', 'parcels'];
const ICON_TAGS_TAG = ['tags'];

var listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

var ListTile = React.createClass({
	propTypes: {
		count: React.PropTypes.string,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	render () {
		return (
			<div className="dashboard-group__list">
				<span className="dashboard-group__list-inner">
					<a href={this.props.href} className="dashboard-group__list-tile">
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count">{this.props.count}</div>
					</a>
					<a href={this.props.href + '?create'} className="dashboard-group__list-create octicon octicon-plus" title="Create" tabIndex="-1" />
				</span>
			</div>
		);
	},
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
					var headingIconClass = 'dashboard-group__heading-icon octicon octicon-';

					if (ICON_TAGS_BRIEFCASE.indexOf(navSection.key) !== -1) { headingIconClass += 'briefcase'; }
					else if (ICON_TAGS_BOOK.indexOf(navSection.key) !== -1) { headingIconClass += 'book'; }
					else if (ICON_TAGS_CALENDAR.indexOf(navSection.key) !== -1) { headingIconClass += 'calendar'; }
					else if (ICON_TAGS_CLOCK.indexOf(navSection.key) !== -1) { headingIconClass += 'clock'; }
					else if (ICON_TAGS_FILE_MEDIA.indexOf(navSection.key) !== -1) { headingIconClass += 'file-media'; }
					else if (ICON_TAGS_FILE_TEXT.indexOf(navSection.key) !== -1) { headingIconClass += 'file-text'; }
					else if (ICON_TAGS_LOCATION.indexOf(navSection.key) !== -1) { headingIconClass += 'location'; }
					else if (ICON_TAGS_MAIL.indexOf(navSection.key) !== -1) { headingIconClass += 'mail'; }
					else if (ICON_TAGS_MEGAPHONE.indexOf(navSection.key) !== -1) { headingIconClass += 'megaphone'; }
					else if (ICON_TAGS_ORGANIZATION.indexOf(navSection.key) !== -1) { headingIconClass += 'organization'; }
					else if (ICON_TAGS_PACKAGE.indexOf(navSection.key) !== -1) { headingIconClass += 'package'; }
					else if (ICON_TAGS_TAG.indexOf(navSection.key) !== -1) { headingIconClass += 'tag'; }
					else { headingIconClass += 'primitive-dot'; }

					return (
						<div className="dashboard-group" key={navSection.key}>
							<div className="dashboard-group__heading">
								<span className={headingIconClass} />
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
				{() => {
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
				}()}
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
		version={Keystone.version}
	/>,
	document.getElementById('home-view')
);
