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
import SecondaryNavigation from '../components/SecondaryNavigation';
import { Alert, Container, Spinner } from 'elemental';

var RelatedItemsList = React.createClass({
	propTypes: {
		list: React.PropTypes.object.isRequired,
		refList: React.PropTypes.object.isRequired,
		relatedItemId: React.PropTypes.string.isRequired,
		relationship: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			columns: this.getColumns(),
			err: null,
			items: null,
		};
	},
	getColumns () {
		const { relationship, refList } = this.props;
		const columns = refList.expandColumns(refList.defaultColumns);
		return columns.filter(i => i.path !== relationship.refPath);
	},
	componentDidMount () {
		this.loadItems();
	},
	loadItems () {
		const { refList, relatedItemId, relationship } = this.props;
		if (!refList.fields[relationship.refPath]) {
			const err = (
				<Alert type="danger">
					<strong>Error:</strong> Related List <strong>{refList.label}</strong> has no field <strong>{relationship.refPath}</strong>
				</Alert>
			);
			return this.setState({ err });
		}
		refList.loadItems({
			columns: this.state.columns,
			filters: [{
				field: refList.fields[relationship.refPath],
				value: { value: relatedItemId },
			}],
		}, (err, items) => {
			// TODO: indicate pagination & link to main list view
			this.setState({ items });
		});
	},
	renderTableCols () {
		const cols = this.state.columns.map((col) => <col width={col.width} key={col.path} />);
		return <colgroup>{cols}</colgroup>;
	},
	renderTableHeaders () {
		const cells = this.state.columns.map((col) => {
			return <th key={col.path}>{col.label}</th>;
		});
		return <thead><tr>{cells}</tr></thead>;
	},
	renderTableRow (item) {
		const cells = this.state.columns.map((col, i) => {
			const ColumnType = Columns[col.type] || Columns.__unrecognised__;
			const linkTo = !i ? `/keystone/${this.props.refList.path}/${item.id}` : undefined;
			return <ColumnType key={col.path} list={this.props.refList} col={col} data={item} linkTo={linkTo} />;
		});
		return <tr key={'i' + item.id}>{cells}</tr>;
	},
	render () {
		if (this.state.err) {
			return <div className="Relationship">{this.state.err}</div>;
		}
		const listHref = '/keystone/' + this.props.refList.path;
		return (
			<div className="Relationship">
				<h3><a href={listHref}>{this.props.refList.label}</a></h3>
				{this.state.items ? (
					<div className="ItemList-wrapper">
						<table cellPadding="0" cellSpacing="0" className="Table ItemList">
							{this.renderTableCols()}
							{this.renderTableHeaders()}
							<tbody>
								{this.state.items.results.map(this.renderTableRow)}
							</tbody>
						</table>
					</div>
				) : (
					<Spinner size="sm" />
				)}
			</div>
		);
	}
});


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
			createIsOpen: visible
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
							onCancel={this.toggleCreate.bind(this, false)} />
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
