const blacklist = require('blacklist');
const Columns = require('../columns');
const CurrentListStore = require('../stores/CurrentListStore');
const ListControl = require('./ListControl');
const React = require('react');
const { Alert } = require('elemental');

const CONTROL_COLUMN_WIDTH = 26;  // icon + padding

var ItemsTable = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.array,
		list: React.PropTypes.object,
	},
	deleteItem (item, e) {
		if (!e.altKey && !confirm('Are you sure you want to delete ' + item.name + '?')) return;
		CurrentListStore.deleteItem(item);
	},
	renderCols () {
		var cols = this.props.columns.map((col) => <col width={col.width} key={col.path} />);
		// add delete col when applicable
		if (!this.props.list.nodelete) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="delete" />);
		}
		// add sort col when applicable
		if (this.props.list.sortable) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="sortable" />);
		}
		return <colgroup>{cols}</colgroup>;
	},
	renderHeaders () {
		var cells = this.props.columns.map((col, i) => {
			// span first col for controls when present
			var span = 1;
			if (!i) {
				if (this.props.list.sortable) span++;
				if (!this.props.list.nodelete) span++;
			}
			return <th key={col.path} colSpan={span}>{col.label}</th>;
		});
		return <thead><tr>{cells}</tr></thead>;
	},
	renderRow (item) {
		var cells = this.props.columns.map((col, i) => {
			var ColumnType = Columns[col.type] || Columns.__unrecognised__;
			var linkTo = !i ? `/keystone/${this.props.list.path}/${item.id}` : undefined;
			return <ColumnType key={col.path} list={this.props.list} col={col} data={item} linkTo={linkTo} />;
		});
		// add sortable icon when applicable
		if (this.props.list.sortable) {
			cells.unshift(<ListControl key="_sort" onClick={this.reorderItems} type="sortable" />);
		}
		// add delete icon when applicable
		if (!this.props.list.nodelete) {
			cells.unshift(<ListControl key="_delete" onClick={(e) => this.deleteItem(item, e)} type="delete" />);
		}
		return <tr key={'i' + item.id}>{cells}</tr>;
	},
	render () {
		var sortable = this.props.list.sortable;
		var tableClass = sortable ? 'sortable ' : '';
		tableClass += 'Table ItemList';
		return (
			<table cellPadding="0" cellSpacing="0" className={tableClass}>
				{this.renderCols()}
				{this.renderHeaders()}
				<tbody>
					{this.props.items.map(this.renderRow)}
				</tbody>
			</table>
		);
	}
});

module.exports = ItemsTable;
