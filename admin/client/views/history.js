'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var HistoryRow = React.createClass({
	render: function () {
		var changes = [];
		this.props.changes.forEach(function (c) {
			if (typeof (c.newValue) === 'object') {
				c.newValue = JSON.stringify(c.newValue);
			}
			if (typeof (c.oldValue) === 'object') {
				c.oldValue = JSON.stringify(c.oldValue);
			}
			changes.push(<div className="history_fieldName">{c.fieldName}<table className="table table-striped embeddedTable"><tr><td className="value_header">new:</td><td className="new_value">{c.newValue}</td></tr><tr><td className="value_header">old:</td><td className="old_value">{c.oldValue}</td></tr></table></div>);
		});

		return (
			<tr>
				<td>{this.props.changedAt}</td>
				<td>{this.props.changedBy}</td>
				<td>{changes}</td>
			</tr>
		);
	},
});

var HistoryTable = React.createClass({
	render: function () {
		var rows = [];
		this.props.history.forEach(function (event) {
			rows.push(<HistoryRow changedAt={event.changedAt} changedBy={event.changedBy.name} changes={event.changes}/>);
		});
		return (
			<table className="table table-striped">
				<thead>
					<tr><th>change date</th><th>changed by</th><th>fields changed</th></tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	},
});

var HistoryView = React.createClass({
	displayName: 'HistoryView',

	render: function () {
		return (
			<div className="container">
				<div className="page-header">
					<h3>{this.props.title}</h3>
				</div>
				<div className="row">
					<div className="col-md-12">
						<HistoryTable history={this.props.history}/>
					</div>
				</div>
			</div>
		);
	},
 });


ReactDOM.render(
	<HistoryView
		title={Keystone.title}
		history={Keystone.history}
	/>,
	document.getElementById('history-view')
);
