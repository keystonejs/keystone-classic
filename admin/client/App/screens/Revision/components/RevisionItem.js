import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ReactJson from 'react-json-view';
import { GlyphButton, ResponsiveText, Container } from '../../../elemental';
import RevisionListItem from './RevisionListItem';
import deepEql from '../utils/deepEql';
import { selectRevision } from '../actions';

const RevisionItem = ({
	currentItem,
	handleButtonClick,
	revisions,
	router,
	selectedRevision,
	selectRevision,
	excludeFields = ['updatedBy', 'updatedAt'],
}) => {
	const renderDifferences = data => {
		const differences = [];
		const rjv = json => (
			<ReactJson
				src={json}
				displayObjectSize={false}
				displayDataTypes={false}
			/>
		);

		/**
		 * Returns item as array or string for React
		 * @param {*} item
		 */
		const wrapItem = item => {
			if (Object.prototype.toString.call(item) === '[object Object]') {
				return [item];
			} else {
				return '';
			}
		};


		

		const recursiveSearch = (currentItem, revision) => {
			for (const k in currentItem) {
				if (excludeField(k)) continue;
				// when we're comparing relationship fields, ignore _id property since that gets updated after every save
				if (!deepEql(currentItem[k], revision[k], '_id')) {
					if (Array.isArray(currentItem[k])) {
						differences.push(
							<tr key={k}>
								<td>{k}</td>
								<td>{rjv(revision[k])}</td>
								<td>{rjv(currentItem[k])}</td>
								
							</tr>
						);
						continue;
					}

					// Deal with undefined objects that cause errors with ReactJson view
					if (Object.prototype.toString.call(currentItem[k]) === '[object Undefined]'
						|| Object.prototype.toString.call(revision[k]) === '[object Undefined]') {
						var itemObject;
						var revisionObject;
						itemObject = (Object.prototype.toString.call(currentItem[k]) === '[object Undefined]') ? [{}] : [currentItem[k]];
						revisionObject = (Object.prototype.toString.call(revision[k]) === '[object Undefined]') ? [{}] : [revision[k]];

						console.log('Dealing with undefined objects:' + JSON.stringify(itemObject) + ' ' + JSON.stringify(revisionObject));
						differences.push(
							<tr key={k}>
								<td>{k}</td>
								<td>{wrapItem(revisionObject)}</td>
								<td>{wrapItem(itemObject)}</td>
								
							</tr>
						);
						continue;
					}

					if (Object.prototype.toString.call(revision[k]) === '[object Object]') {
						recursiveSearch(currentItem[k], revision[k]);
						continue;
					}

					differences.push(
						<tr key={k}>
							<td>{k}</td>
							<td>{revision[k]}</td>
							<td>{currentItem[k]}</td>
							
						</tr>
					);
				}
			}
		};

		recursiveSearch(currentItem, data);
		return differences;
	};

	/**
	 * Check if we should compare this field. By default we exclude updatedBy, updatedAt, workflow
	 * @param {String} field Content field to check
	 */
	const excludeField = field => {
		if (Array.isArray(excludeFields) && excludeFields.indexOf(field) !== -1) {
			return true;
		}
		return false;
	};

	const renderChangesTitle = (revisionChanges) => {
		var changes = [];
		for (const i in revisionChanges) {
			if (excludeField(revisionChanges[i])) continue;
			changes.push(revisionChanges[i]);
		}
		return 'Compare Changes (' + changes.length + ')';
	};

	const applyButton = (
		<GlyphButton color="success" onClick={handleButtonClick}>
			<ResponsiveText hiddenXS={`Restore Revision`} visibleXS="Restore Revision" />
		</GlyphButton>
	);

	const cancelButton = (
		<GlyphButton color="danger" onClick={() => selectRevision({})}>
			<ResponsiveText hiddenXS={`Cancel`} visibleXS="Cancel" />
		</GlyphButton>
	);

	return (
		<div style={style}>
			{revisions.map(revision => {
				const active = selectedRevision._id === revision._id;
				const user = revision.user || revision.u || { name: { first: 'Unkown', last: '' } };
				const { first, last } = user.name;
				return (
					<div key={revision._id}>
						<RevisionListItem active={active} noedit onClick={() => selectRevision(revision)}>
							<span style={changedStyle}>
								{renderChangesTitle(revision.changes)}
							</span>
							<span style={authorStyle}>
								{moment(revision.time || revision.t).format('dddd Do MMM YYYY, h:mm:ss a')} by {`${first} ${last}`}
							</span>
						</RevisionListItem>
						{active
							? <div className="RevisionsItem__table--container">
								<table className="RevisionsItem__table">
									<tr>
										<th>Fields</th>
										<th>Revision</th>
										<th>Current</th>
										
									</tr>
									{renderDifferences(revision.data || revision.d)}
								</table>
								<div style={{ textAlign: 'left', padding: '0px' }}>
									<Container>
										{applyButton}&nbsp;{cancelButton}
									</Container>
								</div>
							</div>
							: null
						}
					</div>
				);
			}
			)}
		</div>
	);
};

const style = {
	textAlign: 'center',
};

const authorStyle = {
	textAlign: 'center',
	float: 'right',
};

const changedStyle = {
	textAlign: 'left',
	float: 'left',
};

const mapStateToProps = state => ({
	currentItem: state.revisions.currentItem,
	revisions: state.revisions.revisions,
	selectedRevision: state.revisions.selectedRevision,
});

export default connect(mapStateToProps, {
	selectRevision,
})(RevisionItem);
