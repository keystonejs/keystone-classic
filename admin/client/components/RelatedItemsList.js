import React from 'react';
import Columns from '../columns';
import { Alert, Spinner } from 'elemental';

const RelatedItemsList = React.createClass({
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
	renderItems () {
		return this.state.items.results.length ? (
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
			<h4>No related {this.props.refList.plural}</h4>
		);
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
			const linkTo = !i ? `${Keystone.adminPath}/${this.props.refList.path}/${item.id}` : undefined;
			return <ColumnType key={col.path} list={this.props.refList} col={col} data={item} linkTo={linkTo} />;
		});
		return <tr key={'i' + item.id}>{cells}</tr>;
	},
	render () {
		if (this.state.err) {
			return <div className="Relationship">{this.state.err}</div>;
		}
		const listHref = `${Keystone.adminPath}/${this.props.refList.path}`;
		return (
			<div className="Relationship">
				<h3><a href={listHref}>{this.props.refList.label}</a></h3>
				{this.state.items ? this.renderItems() : <Spinner size="sm" />}
			</div>
		);
	},
});

module.exports = RelatedItemsList;
