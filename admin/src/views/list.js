const React = require('react');

const Columns = require('../columns');
const ListHeader = require('../components/ListHeader');
const ListControl = require('../components/ListControl');
const CreateForm = require('../components/CreateForm');

const CurrentListStore = require('../stores/CurrentListStore');

const { BlankState, Button, Spinner } = require('elemental');

const CONTROL_COLUMN_WIDTH = 26;  // icon + padding

const ListView = React.createClass({

	displayName: 'ListView',

	getInitialState () {
		return this.getStateFromStore();
	},

	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
		if (!this.state.ready) {
			CurrentListStore.loadItems();
		}
	},

	componentWillUnmount () {
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},

	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},

	getStateFromStore () {
		return {
			list: CurrentListStore.getList(),
			ready: CurrentListStore.isReady(),
			items: CurrentListStore.getItems(),
			columns: CurrentListStore.getActiveColumns()
		};
	},
	
	toggleCreateModal (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	reorderItems: function() {
		alert('TODO: Add re-ordering of items');
	},

	removeItem: function() {
		confirm('Are you sure you want to remove this item?');
	},

	renderCols: function() {
		var cols = this.state.columns.map((col) => <col width={col.width} key={col.path} />);
		// add delete col when applicable
		if (!this.state.list.nodelete) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="delete" />);
		}
		// add sort col when applicable
		if (this.state.list.sortable) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="sortable" />);
		}
		return <colgroup>{cols}</colgroup>;
	},

	renderHeaders: function() {
		var cells = this.state.columns.map((col, i) => {
			// span first col for controls when present
			var span = 1;
			if (!i) {
				if (Keystone.list.sortable) span++;
				if (!Keystone.list.nodelete) span++;
			}
			return <th key={col.path} colSpan={span}>{col.label}</th>;
		});
		return <thead><tr>{cells}</tr></thead>;
	},

	renderRow: function(item) {
		var cells = this.state.columns.map((col) => {
			var ColumnType = Columns[col.type] || Columns.__unrecognised__;
			return <ColumnType key={col.path} list={Keystone.list} col={col} data={item} />;
		});
		// add sortable icon when applicable
		if (Keystone.list.sortable) {
			cells.unshift(<ListControl key="_sort" onClick={this.reorderItems} type="sortable" />);
		}
		// add delete icon when applicable
		if (!Keystone.list.nodelete) {
			cells.unshift(<ListControl key="_delete" onClick={this.removeItem} type="delete" />);
		}
		return <tr key={'i' + item.id}>{cells}</tr>;
	},
	
	renderBlankState () {
		if (Object.keys(this.state.items.results).length) return null;
		return (
			<div className="container">
				<BlankState style={{ marginTop: 40 }}>
					<BlankState.Heading>No {Keystone.list.plural.toLowerCase()} found&hellip;</BlankState.Heading>
					{this.renderCreateButton()}
				</BlankState>
				{this.renderCreateForm()}
			</div>
		);
	},
	
	renderActiveState () {
		if (!Object.keys(this.state.items.results).length) return null;
		
		var sortable = Keystone.list.sortable;
		var tableClass = sortable ? 'sortable ' : '';
		tableClass += 'Table ItemList';
		return (
			<div>
				<ListHeader />
				<div className="container">
					<div className="ItemList-wrapper">
						<table cellPadding="0" cellSpacing="0" className={tableClass}>
							{this.renderCols()}
							{this.renderHeaders()}
							<tbody>
								{this.state.items.results.map(this.renderRow)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	},
	
	renderCreateButton () {
		var props = { type: 'success' };
		if (this.state.list.nocreate) return null;
		if (this.state.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" />
				Create {this.state.list.singular}
			</Button>
		);
	},
	
	renderCreateForm () {
		return <CreateForm list={this.state.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},

	render: function() {
		
		return !this.state.ready ? (
			<div className="view-loading-indicator"><Spinner /></div>
		) : (
			<div>
				{this.renderBlankState()}
				{this.renderActiveState()}
			</div>
		);
	}

});

var target = document.getElementById('list-view');
if (target) {
	React.render(<ListView />, target);
}
