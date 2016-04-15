'use strict';

import List from '../lib/List';

for (const key in Keystone.lists) {
	if ({}.hasOwnProperty.call(Keystone.lists, key)) {
		exports[key] = new List(Keystone.lists[key]);
	}
}
