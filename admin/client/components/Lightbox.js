import React from 'react';
import blacklist from 'blacklist';
import Portal from './Portal';
import Transition from 'react-addons-css-transition-group';

const BODY = document.getElementsByTagName('body')[0];

var Lightbox = React.createClass({
	displayName: 'Lightbox',
	propTypes: {
		backdropClosesModal: React.PropTypes.bool,
		className: React.PropTypes.string,
		enableKeyboardInput: React.PropTypes.bool,
		height: React.PropTypes.number,
		images: React.PropTypes.array,
		initialImage: React.PropTypes.number,
		isOpen: React.PropTypes.bool,
		onCancel: React.PropTypes.func,
		showCloseButton: React.PropTypes.bool,
		width: React.PropTypes.number,
	},
	getDefaultProps () {
		return {
			backdropClosesModal: true,
			enableKeyboardInput: true,
			initialImage: 0,
			height: 600,
			width: 900,
		};
	},
	getInitialState () {
		return {
			currentImage: this.props.initialImage,
		};
	},
	componentWillReceiveProps (nextProps) {
		this.setState({
			currentImage: nextProps.initialImage,
		});

		if (nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		} else {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}

		if (nextProps.isOpen) {
			BODY.style.overflow = 'hidden';
		} else {
			BODY.style.overflow = null;
		}
	},

	handleKeyboardInput (event) {
		if (event.keyCode === 37) {
			this.gotoPrevious();
		} else if (event.keyCode === 39) {
			this.gotoNext();
		} else if (event.keyCode === 27) {
			this.props.onCancel();
		} else {
			return false;
		}
	},
	gotoPrevious () {
		if (this.state.currentImage === 0) return;

		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	},
	gotoNext () {
		if (this.state.currentImage === (this.props.images.length - 1)) return;

		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	},

	renderArrowPrev () {
		return (
			<Transition transitionName="react-transitiongroup-fade" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
				{(this.state.currentImage > 0) && <button type="button" style={Object.assign({}, styles.arrow, styles.arrowPrev)} onClick={this.gotoPrevious} className="octicon octicon-chevron-left" />}
			</Transition>
		);
	},
	renderArrowNext () {
		return (
			<Transition transitionName="react-transitiongroup-fade" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
				{(this.state.currentImage < (this.props.images.length - 1)) && <button type="button" style={Object.assign({}, styles.arrow, styles.arrowNext)} onClick={this.gotoNext} className="octicon octicon-chevron-right" />}
			</Transition>
		);
	},
	renderBackdrop () {
		if (!this.props.isOpen) return;

		return <div key="backdrop" style={styles.backdrop} onClick={this.props.backdropClosesModal ? this.props.onCancel : null} />;
	},
	renderCloseButton () {
		if (!this.props.showCloseButton) return;

		return <button key="close" style={styles.close} onClick={this.props.onCancel}>Close</button>;
	},
	renderDialog () {
		if (!this.props.isOpen) return;

		return (
			<div key="dialog" style={Object.assign({}, styles.dialog, { height: this.props.height, width: this.props.width })}>
				{this.renderImages()}
				{this.renderArrowPrev()}
				{this.renderArrowNext()}
				{this.renderCloseButton()}
			</div>
		);
	},
	renderImages () {
		let { images } = this.props;
		let { currentImage } = this.state;
		if (!images || !images.length) return;

		return (
			<Transition transitionName="react-transitiongroup-fade" style={styles.imageContainer} component="div" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
				<img key={'image' + currentImage} src={images[currentImage]} style={styles.image} />
			</Transition>
		);
	},
	render () {
		let props = blacklist(this.props, 'backdropClosesModal', 'initialImage', 'height', 'images', 'isOpen', 'onCancel', 'showCloseButton', 'width');

		return (
			<Portal {...props}>
				<Transition transitionName="react-transitiongroup-fade" component="div" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
					{this.renderDialog()}
				</Transition>
				<Transition transitionName="react-transitiongroup-fade" component="div" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
					{this.renderBackdrop()}
				</Transition>
			</Portal>
		);
	},
});

const styles = {
	arrow: {
		background: 'none',
		border: 'none',
		bottom: 0,
		color: 'white',
		fontSize: 48,
		right: 0,
		outline: 'none',
		padding: 0,
		position: 'absolute',
		top: 0,
		width: '10%',
		zIndex: 1002,

		// disable user select
		WebkitTouchCallout: 'none',
		WebkitUserSelect:   'none',
		MozUserSelect:      'none',
		msUserSelect:       'none',
		userSelect:         'none',
	},
	arrowNext: {
		right: 0,
	},
	arrowPrev: {
		left: 0,
	},
	backdrop: {
		backgroundColor: 'rgba(0,0,0,0.66)',
		bottom: 0,
		left: 0,
		position: 'fixed',
		right: 0,
		top: 0,
		zIndex: 1000,
	},
	close: {
		background: 'none',
		border: 'none',
		bottom: -32,
		color: 'white',
		fontSize: 16,
		height: 32,
		left: 0,
		marginLeft: 'auto',
		marginRight: 'auto',
		outline: 'none',
		padding: 0,
		position: 'absolute',
		right: 0,
		textAlign: 'center',
		textTransform: 'uppercase',
		width: 100,
	},
	dialog: {
		// backgroundColor: 'rgba(255,255,255,0.26)',
		left: 0,
		lineHeight: 1,
		marginLeft: 'auto',
		marginRight: 'auto',
		maxHeight: '100%',
		maxWidth: '100%',
		position: 'fixed',
		right: 0,
		top: '50%',
		zIndex: 1001,

		WebkitTransform: 'translateY(-50%)',
		MozTransform:    'translateY(-50%)',
		msTransform:     'translateY(-50%)',
		transform:       'translateY(-50%)',
	},
	image: {
		boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
		maxHeight: '100%',
		maxWidth: '80%',
		position: 'absolute',

		// center the image within the dialog
		left: '50%',
		top: '50%',
		WebkitTransform: 'translate(-50%, -50%)',
		MozTransform:    'translate(-50%, -50%)',
		msTransform:     'translate(-50%, -50%)',
		transform:       'translate(-50%, -50%)',

		// disable user select
		WebkitTouchCallout: 'none',
		WebkitUserSelect:   'none',
		MozUserSelect:      'none',
		msUserSelect:       'none',
		userSelect:         'none',

	},
};

module.exports = Lightbox;
