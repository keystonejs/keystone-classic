/**
 * Analytics
 *
 * Utility class to handle admin interface analytics. Exports Analytics.init, Analytics.sendEvent,
 * Analytics.sendPageview and Analytics.send
 */

// Constants
const TRACKER_NAME = 'adminui';
const UA_STRING = 'UA-49258834-9';

class Analytics {
	// Initialize admin interface Google Analytics tracker
	static init () {
		this.ga('create', UA_STRING, 'auto', TRACKER_NAME);
		this.sendPageview();
	}

	// Send an event
	static sendEvent () {
		this.send('event', ...arguments);
	}

	// Send a pageview
	static sendPageview () {
		this.send('pageview');
	}

	// Send something with our tracker name
	static send () {
		this.ga(`${TRACKER_NAME}.send`, ...arguments);
	}

	static ga () {
		// TODO Gate here against option to disable
		window.ga && window.ga(...arguments);
	}
}

export default Analytics;
