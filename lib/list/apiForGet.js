/*
# List.apiForGet(options)

Returns JSON API middleware for a GET /:id endpoint

Supports the following options:

### `id` (string)

Optional; Defaults to `"id"`

The name of the express url param that contains the ID to get.

### `query` `function(query, req, res)`

Optional

A function that modifies the query to find the item. You can
use this to check anything about the request (e.g. permissions), and/or modify
the conditions on the mongoose query.

You can handle the response from within this function; return `false` to stop
the API middleware from continuing.

### `query` `object`

Optional

An object of additional `where` conditions to add to the `query`

### `transform` `function(item, req, res)`

A function that transforms the object before it is sent as JSON.
*/

module.exports = function apiForGet (options) {
	var idParam = options.id || 'id';
	var List = this;
	return function (req, res) {
		var id = req.params[idParam];
		var query = List.model.findById(id);
		if (typeof options.query === 'function') {
			var result = options.query(query, req);
			if (result === false) return;
		} else if (typeof options.query === 'object') {
			query.where(options.query);
		}
		query.exec(function (err, item) {
			if (err) return res.status(500).json({ err: 'database error', detail: err });
			if (!item) return res.status(404).json({ err: 'not found', id: id });
			if (options.transform) {
				item = options.transform(item, req, res);
				if (item === false) return;
			}
			return res.json({
				data: item,
			});
		});
	};
};
