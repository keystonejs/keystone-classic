import React from 'react';

export function renderDevTools(store) {
	if (Keystone.devMode) {
		let { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
		return (
		<DebugPanel top right bottom>
			<DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
		</DebugPanel>
		);
	}

	return null;
}
