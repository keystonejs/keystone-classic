var React = require('react');

var Columns = require('../columns');
var ListHeader = require('../components/ListHeader');
var ListControl = require('../components/ListControl');

var CurrentListStore = require('../stores/CurrentListStore');

var ListView = React.createClass({

	displayName: 'ListView',

	getInitialState () {
		return {
			ready: CurrentListStore.isReady(),
			items: CurrentListStore.getItems()
		};
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
		this.setState({
			ready: CurrentListStore.isReady(),
			items: CurrentListStore.getItems()
		});
	},

	reorderItems: function() {
		alert('TODO: Add re-ordering of items');
	},

	removeItem: function() {
		confirm('Are you sure you want to remove this item?');
	},

	renderCols: function() {
		var controlColumnWidth = 26; // width of the icon + padding

		var cols = Keystone.columns.map(function(col) {
			if (col.width) {
				return <col width={col.width} key={col.path} />;
			} else {
				return <col key={col.path} />;
			}
		});

		// add delete col when applicable
		if (!Keystone.list.nodelete) {
			cols.unshift(<col width={controlColumnWidth} key="delete" />);
		}

		// add sort col when applicable
		if (Keystone.list.sortable) {
			cols.unshift(<col width={controlColumnWidth} key="sortable" />);
		}

		return cols;
	},

	renderHeaders: function() {
		var cells = Keystone.columns.map(function(col, i) {
			// add extra cols when applicable
			var span = 1;

			if (!i) {
				if (Keystone.list.sortable) span++;
				if (!Keystone.list.nodelete) span++;
			}

			return <th key={col.path} colSpan={span}>{col.label}</th>;
		});

		return <thead>{cells}</thead>;
	},

	renderRow: function(item) {
		var cells = Keystone.columns.map(function(col) {
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

	render: function() {
		if (!this.state.ready) return null;
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
	}

});

var target = document.getElementById('list-view-table');
if (target) {
	React.render(<ListView />, target);
}
