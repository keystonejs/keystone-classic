const React = require('react');
const ReactDOM = require('react-dom');
const request = require('superagent');

const CreateForm = require('../components/CreateForm');
const EditForm = require('../components/EditForm');
const EditFormHeader = require('../components/EditFormHeader');
const FlashMessages = require('../components/FlashMessages');
const Footer = require('../components/Footer');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');
const SecondaryNavigation = require('../components/SecondaryNavigation');

const { Container, Spinner } = require('elemental');

var RelatedItemsList = React.createClass({
	render () {
		var json = JSON.stringify(Keystone.list.relationships, null, '  ');
		return (
			<span>
				{json}
			</span>
		);
	}
});


var ItemView = React.createClass({

	displayName: 'ItemView',

	getInitialState () {
		return {
			createIsOpen: false,
			itemData: null
		};
	},

	componentDidMount () {
		this.loadItemData();
	},

	loadItemData () {
		request.get('/keystone/api/' + this.props.list.path + '/' + this.props.itemId + '?drilldown=true')
			.set('Accept', 'application/json')
			.end((err, res) => {
				if (err || !res.ok) {
					// TODO: nicer error handling
					console.log('Error loading item data:', res ? res.text : err);
					alert('Error loading data (details logged to console)');
					return;
				}
				this.setState({
					itemData: res.body
				});
			});
	},

	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	renderRelationships () {
		var relationships = [];
		for (var relName in this.props.list.relationships) {
			relationships.push(this.props.list.relationships[relName]);
		}
		relationships = relationships.map((relationship) => {
			var unusedForNow = (
				<RelatedItemsList relationship={relationship} relatedItemId={this.props.itemId} />
			);
			var filter = JSON.stringify({
				match: 'exact',
				inverted: 'false',
				value: this.props.itemId
			});
			var link = '/keystone/' + relationship.ref + '?' + relationship.refPath + '=' + filter;
			return (
				<ul>
					<li>{relationship.path} ({relationship.ref} list) <a href={link}>visit</a>
					</li>
				</ul>
			);
		});
		return (
			<Container>
				<h4>Relationships</h4>
				{relationships}
			</Container>
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
							onCancel={this.toggleCreate.bind(this, false)} />
						<FlashMessages
							messages={this.props.messages} />
						<EditForm
							list={this.props.list}
							data={this.state.itemData} />
						{ this.renderRelationships() }
						{/*
						TODO:
							New component for item relationships:
							<ItemRelationships list={this.props.list} itemId={this.props.itemId} />

							The ItemRelationships component would loop through defined relationships,
							and render a component for each:
							<RelatedItemsList relationship={relationship} relatedItemId={this.props.itemId} />
						*/}
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
		list={Keystone.list}
		messages={Keystone.messages}
		nav={Keystone.nav}
		signoutUrl={Keystone.signoutUrl}
		User={Keystone.User}
		user={Keystone.user}
		version={Keystone.version}
	/>,
	document.getElementById('item-view')
);
