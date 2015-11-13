'use strict';

import List from '../lib/List';

for (let key in Keystone.lists) {
	exports[key] = new List(Keystone.lists[key]);
}
