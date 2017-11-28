import React, { Component, PropTypes } from 'react';
// import moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Alert from '../../elemental/Alert';
import RevisionHeader from './components/RevisionHeader';
import RevisionItem from './components/RevisionItem';
import { Center, Container, Spinner } from '../../elemental';
import ConfirmationDialog from '../../shared/ConfirmationDialog';

import { selectList } from '../List/actions';
import { selectItem } from '../Item/actions';
import { applyChanges, loadRevisions, selectRevision } from './actions';

class Revision extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired,
	}

	constructor (props) {
		super(props);
		this.state = {
			isConfirmationOpen: false,
			itemTitle: '',
		};
	}

	componentDidMount () {
		// When we directly navigate to an item without coming from another client
		// side routed page before, we need to select the list before initializing the item
		// and then load the revisions
		if (!this.props.currentList || this.props.currentList.id !== this.props.params.listId) {
			this.props.selectList(this.props.params.listId);
			this.props.selectItem(this.props.params.itemId);
		}
		this.props.loadRevisions();
		//this.getItemTitle(this.props.params.listId);
	}

	componentWillUnmount () {
		this.props.selectRevision({});
	}

	removeConfirmationDialog = cb => {
		this.setState({ isConfirmationOpen: false }, cb);
	}

	handleButtonClick = () => {
		this.setState({ isConfirmationOpen: true });
	}

	getItemTitle = (id) => {
		this.props.currentList.loadItem(id, function (err, data) {
			console.log(JSON.stringify(data));
			this.setState({ itemTitle: data.slug });
		}
		);
	};

	renderError = () => {
		return (
			<Container>
				<Alert color="danger" style={{ marginTop: '2em' }}>
					{this.props.error}.&nbsp;
					<Link to={`${Keystone.adminPath}/${this.props.routeParams.listId}`}>
						Go back to {this.props.routeParams.listId}?
					</Link>
				</Alert>
			</Container>
		);
	}

	renderConfirmationDialog = () => (
		<ConfirmationDialog
			confirmationLabel="Apply changes"
			isOpen={this.state.isConfirmationOpen}
			onCancel={this.removeConfirmationDialog}
			onConfirmation={() => this.removeConfirmationDialog(this.props.applyChanges.bind(null, this.context.router))}
		>
			<div>
				Are you sure you want to rollback to this version?
			</div>
		</ConfirmationDialog>
	)

	render () {
		if (!this.props.ready) {
			return (
				<Center height="50vh" data-screen-id="revision">
					<Spinner />
				</Center>
			);
		}
		if (this.props.error) {
			return this.renderError();
		}

		return (
			<div style={styles.container}>
				<RevisionHeader {...this.props} title={this.state.itemTitle} />
				<RevisionItem
					handleButtonClick={this.handleButtonClick}
					{...this.props}
					excludeFields={this.props.currentList.revisions.excludeFields}
				/>
				{this.renderConfirmationDialog()}
			</div>
		);
	}
};

const styles = {
	container: {
		padding: '1em 20px',
		margin: '0 auto',
		maxWidth: 1170,
	},
};

const mapStateToProps = state => ({
	currentList: state.lists.currentList,
	revisions: state.revisions.revisions,
	id: state.item.id,
	// this is similar to state.item but its shape is different
	selectedRevision: state.revisions.selectedRevision,
	error: state.revisions.error,
	ready: state.revisions.ready,
});

export default connect(mapStateToProps, {
	applyChanges,
	selectList,
	selectItem,
	selectRevision,
	loadRevisions,
})(Revision);
