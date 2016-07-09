/**
 * The Home view is the view one sees at /keystone. It shows a list of all lists,
 * grouped by their section.
 */

import React from 'react';
import { Container, Spinner } from 'elemental';
import { connect } from 'react-redux';

import { plural } from '../../../utils/string';
import Lists from './components/Lists';
import Section from './components/Section';
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
	getCount (key) {
		// If we have previous counts already saved, show them while we fetch
		// the new ones. The counts can change e.g. if items were created since
		// the last visit to the homepage
		return plural(this.props.counts[key], '* Item', '* Items');
	},
	getSpinner () {
		if (Object.keys(this.props.counts).length === 0
			&& (this.props.error || this.props.loading)) {
			return (
				<Spinner />
			);
		}
		return null;
	},
	renderFlatNav () {
		return (
			<div className="dashboard-group__lists">
				<Lists
					counts={this.props.counts}
					lists={Keystone.lists}
					spinner={this.getSpinner()}
				/>
			</div>
		);
	},
	renderGroupedNav () {
		return (
			<div>
				{Keystone.nav.sections.map((navSection) => {
					return (
						<Section key={navSection.key} id={navSection.key} label={navSection.label}>
							<div className="dashboard-group__lists">
								<Lists
									counts={this.props.counts}
									lists={navSection.lists}
									spinner={this.getSpinner()}
								/>
							</div>
						</Section>
					);
				})}
				{this.renderOrphanedLists()}
			</div>
		);
	},
	renderOrphanedLists () {
		if (!Keystone.orphanedLists.length) return;
		return (
			<Section label="Other" iconClass="dashboard-group__heading-icon octicon octicon-database">
				<div className="dashboard-group__lists">
					<Lists
						counts={this.props.counts}
						lists={Keystone.orphanedLists}
						spinner={this.getSpinner()}
					/>
				</div>
			</Section>
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

export {
	HomeView,
};

export default connect((state) => ({
	counts: state.home.counts,
	loading: state.home.loading,
	error: state.home.error,
}))(HomeView);
