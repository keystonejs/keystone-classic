import React from 'react';
import { Columns } from 'FieldTypes';
import { Alert, Spinner } from 'elemental';
import { titlecase } from '../../../../utils/string';

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
	componentDidMount () {
		this.loadItems();
	},
	getColumns () {
		const { relationship, refList } = this.props;
		const columns = refList.expandColumns(refList.defaultColumns);
		const refListNameColumn = columns.filter(column => column.path === refList.namePath || (column.path === 'id' && refList.namePath === '_id'));
		const refListRelationshipFieldColumn = columns.filter(column => column.path === relationship.refPath);
		return [refListNameColumn[0], refListRelationshipFieldColumn[0]];
	},
	getColumnType (type) {
		return Columns[type] || Columns.text;
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
	renderRelationshipColumn (item) {
		return <td key={'Relationship' + item.id || ''}>{this.props.relationship.label || titlecase(this.props.relationship.path)}</td>;
	},
	renderParentColumn (item) {
		const listHref = `${Keystone.adminPath}/${this.props.refList.path}`;
		return <td key={'Parent' + item.id} className="Relationship__link"><a href={listHref}>{this.props.refList.label}</a></td>;
	},
	renderNameColumn (item) {
		const column = this.state.columns[0];
		let ColumnType = this.getColumnType(column.type);
		const linkTo = `${Keystone.adminPath}/${this.props.refList.path}/${item.id}`;
		return <ColumnType key={column.path} list={this.props.refList} col={column} data={item} linkTo={linkTo} />;
	},
	renderFieldColumn (item) {
		const listHref = `${Keystone.adminPath}/${this.props.refList.path}`;
		const linkValue = this.state.columns[1] ? <a href={listHref}>{this.state.columns[1].label}</a> : null;
		return <td key={'Field' + item.id} className="Relationship__link">{linkValue}</td>;
	},
	renderValueColumn (item) {
		const column = this.state.columns[1];
		let ColumnType = this.getColumnType(column.type);
		const linkTo = `${Keystone.adminPath}/${this.props.refList.path}/${item.id}`;
		return <ColumnType key={column.path} list={this.props.refList} col={column} data={item} linkTo={linkTo} />;
	},
	renderTableRow (item) {
		return (
			<tr key={'table-row-item-' + item.id}>{[
				this.renderRelationshipColumn(item),
				this.renderParentColumn(item),
				this.renderNameColumn(item),
				this.renderFieldColumn(item),
				this.renderValueColumn(item),
			]}</tr>
		);
	},
	renderItems () {
		return this.state.items.results.map(this.renderTableRow);
	},
	renderSpinner () {
		return <tr><td><Spinner size="sm" /></td></tr>;
	},
	renderNoRelationships () {
		return (
			<tr>
				{this.renderRelationshipColumn({})}
				{this.renderParentColumn({})}
				<td>None</td>
				<td></td>
				<td></td>
			</tr>
		);
	},
	renderError () {
		return <tr><td>{this.state.err}</td></tr>;
	},
	renderRelationshipTableBody () {
		const loadedItems = this.state.items;
		const results = this.state.items && this.state.items.results;
		let tbody = null;
		if (this.state.err) {
			tbody = this.renderError();
		} else if (loadedItems && results.length) {
			tbody = this.renderItems();
		} else if (loadedItems && !results.length) {
			tbody = this.renderNoRelationships();
		} else {
			tbody = this.renderSpinner();
		}
		return tbody;
	},
	render () {
		return <tbody className="Relationship">{this.renderRelationshipTableBody()}</tbody>;
	},
});

module.exports = RelatedItemsList;
