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

		const recursiveSearch = (currentItem, revision) => {
			for (const k in currentItem) {
				if (k === 'updatedBy' || k === 'updatedAt') continue;
				// when we're comparing relationship fields, ignore _id property since that gets updated after every save
				if (!deepEql(currentItem[k], revision[k], '_id')) {
					if (Array.isArray(currentItem[k])) {
						differences.push(
							<tr key={k}>
								<td>{k}</td>
								<td>{rjv(currentItem[k])}</td>
								<td>{rjv(revision[k])}</td>
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
							<td>{currentItem[k]}</td>
							<td>{revision[k]}</td>
						</tr>
					);
				}
			}
		};

		recursiveSearch(currentItem, data);

		return differences;
	};

	const applyButton = (
		<GlyphButton color="success" onClick={handleButtonClick}>
			<ResponsiveText hiddenXS={`Apply`} visibleXS="Apply" />
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
				const { first, last } = revision.user.name;
				return (
					<div key={revision._id}>
						<RevisionListItem active={active} noedit onClick={() => selectRevision(revision)}>
							{moment(revision.time).format('YYYY-MM-DD hh:mm:ssa')} by {`${first} ${last}`}
						</RevisionListItem>
						{active
							? <div className="RevisionsItem__table--container">
								<table className="RevisionsItem__table">
									<tr>
										<th>Fields</th>
										<th>Current</th>
										<th>Rollback</th>
									</tr>
									{renderDifferences(revision.data)}
								</table>
								<div>
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

const mapStateToProps = state => ({
	currentItem: state.revisions.currentItem,
	revisions: state.revisions.revisions,
	selectedRevision: state.revisions.selectedRevision,
});

export default connect(mapStateToProps, {
	selectRevision,
})(RevisionItem);
