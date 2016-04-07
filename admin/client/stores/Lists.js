'use strict';

import List from '../lib/List';

for (const key in Keystone.lists) {
	if ({}.hasOwnProperty.call(Keystone.lists, key)) {
		exports[Keystone.lists[key].path] = new List(Keystone.lists[key]);
	}
}
