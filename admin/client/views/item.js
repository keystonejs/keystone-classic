import React from 'react';
import ReactDOM from 'react-dom';
import Columns from '../columns';
import Lists from '../stores/Lists';
import CreateForm from '../components/CreateForm';
import EditForm from '../components/EditForm';
import EditFormHeader from '../components/EditFormHeader';
import FlashMessages from '../components/FlashMessages';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import PrimaryNavigation from '../components/PrimaryNavigation';
import RelatedItemsList from '../components/RelatedItemsList';
import SecondaryNavigation from '../components/SecondaryNavigation';
import { Alert, Container, Spinner } from 'elemental';

var ItemView = React.createClass({

	displayName: 'ItemView',

	getInitialState () {
		return {
			createIsOpen: false,
			itemData: null,
		};
	},

	componentDidMount () {
		this.loadItemData();
	},

	loadItemData () {
		this.props.list.loadItem(this.props.itemId, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				// TODO: nicer error handling
				console.log('Error loading item data', err);
				alert('Error loading data (details logged to console)');
				return;
			}
			this.setState({ itemData });
		});
	},

	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible,
		});
	},

	renderRelationships () {
		let { relationships } = this.props.list;
		let keys = Object.keys(relationships);
		if (!keys.length) return;
		return (
			<div>
				<h2>Relationships</h2>
				{keys.map(key => {
					let relationship = relationships[key];
					let refList = Lists[relationship.ref];
					return <RelatedItemsList key={relationship.path} list={this.props.list} refList={refList} relatedItemId={this.props.itemId} relationship={relationship} />;
				})}
			</div>
		);
	},

	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={this.props.brand}
						currentListKey={this.props.list.path}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						/>
					<PrimaryNavigation
						currentSectionKey={this.props.nav.currentSection.key}
						brand={this.props.brand}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl} />
					<SecondaryNavigation
						currentListKey={this.props.list.path}
						lists={this.props.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					<EditFormHeader
						list={this.props.list}
						data={this.state.itemData}
						drilldown={this.state.itemDrilldown}
						toggleCreate={this.toggleCreate} />
					<Container>
						<CreateForm
							list={this.props.list}
							isOpen={this.state.createIsOpen}
							onCancel={() => this.toggleCreate(false)} />
						<FlashMessages
							messages={this.props.messages} />
						<EditForm
							list={this.props.list}
							data={this.state.itemData} />
						{this.renderRelationships()}
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
	<ItemView
		appversion={Keystone.appversion}
		backUrl={Keystone.backUrl}
		brand={Keystone.brand}
		itemId={Keystone.itemId}
		list={Lists[Keystone.list.key]}
		messages={Keystone.messages}
		nav={Keystone.nav}
		signoutUrl={Keystone.signoutUrl}
		User={Keystone.User}
		user={Keystone.user}
		version={Keystone.version}
	/>,
	document.getElementById('item-view')
);
