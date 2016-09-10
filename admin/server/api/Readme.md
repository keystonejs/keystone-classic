# Admin API

The Admin APIs are used specifically by the Admin UI but may also be used by applications if they require no modifications.

The plan is to move this API Functionality into a lower level in Keystone's core so that they are available through official Keystone APIs, and the Admin APIs become default implementations of the generic features.

## Common Features

API Failures (e.g. invalid input, database errors, etc) will be sent with an appropriate HTTP response code (`4XX` or `5XX`) as specified for the endpoint, along with useful error information as JSON in the response body as available.

All POST API endpoints are protected with CSRF. If the CSRF check fails, `403` will be sent as the HTTP Response code and the following data will be in the response body:

```js
{
	error: 'invalid csrf'
}
```

# Session API

Manages creating, destroying and validating KeystoneJS sessions (specifically, logged in users)

## Get

```
GET /api/session
```

Returns a single `user` property with either the currently logged in user, or `undefined`.

### Response

#### When signed in:

```js
{
	user: req.user
}
```

#### Signed out or new session:

```js
{
	user: undefined
}
```

## Sign In

```
POST /api/session/signin
```

Signs in with the provided credentials. Returns the matched user, or error information.

Must include CSRF token in headers.

### POST Data

* `email` (String; required) the email to find
* `password` (String; required) the password to check

Email is used to identify a single item in the `User` list. The schema must have both `email` and `password` fields. If a user is found, the password is compared using BCrypt, to validate the signin credentials.

For example:

```js
{
	email: 'user@keystonejs.com',
	password: 'admin'
}
```

### Response

A successful login will return success with the data from the user item. For example:

```js
{
	success: true,
	user: user
}
```

If either `username` or `email` is not provided, or the login fails, HTTP `401` is sent. All other errors will cause HTTP `500` to be sent. Some examples:

```js
// 401 email or password not provided
{
	error: 'email and password required'
}
```

```js
// 401 user not found or invalid password
{
	error: 'invalid details'
}
```

```js
// 500 database error
{
	error: 'database error',
	detail: err
}
```

## Sign Out

```
POST /api/session/signout
```

Signs the current user out (if any). Takes no data.

### Response

A successful sign-out will return `success: true`. For example:

```js
{
	success: true,
}
```

Any error will cause HTTP `500` to be sent. For example:

```js
// 500 session error
{
	error: 'session error',
	detail: err
}
```


# Lists API

Manages creating, listing, updating and deleting items in a List.

## Create a new Item

```
POST /api/{list}/create
```

Creates a new item with the provided data. Successful calls return the data of the new item, similar to `GET /api/{list}/:id`. For example, creating a new user:

```js
{
	name: 'Test User',
	email: 'user-1469454400942@keystonejs.com',
	password: 'test1234'
}
```

Returns the following:

```js
{
	id: '5796198d49b4a30ad983b339',
	name: 'Test User',
	fields: {
		name: {
			first: 'Test',
			last: 'User'
		}
		email: 'user-1469454400942@keystonejs.com',
		password: '******',
		isAdmin: false
	}
}
```

### Errors

This endpoint will first validate the data; validation errors are returned with HTTP `400`. For example, creating a new user when name, email and password are all required:

```js
{
	name: '',
	email: '',
	password: ''
}
```

```js
// 400 validation error
{
	error: 'validation errors',
	detail: {
		name: {
			type: 'required',
			error: 'name is required'
		},
		email: {
			type: 'required',
			error: 'email is required'
		},
		password: {
			type: 'required',
			error: 'password is required'
		}
	}
}
```

Some fields have additional validation rules. For example, Email fields must match a valid email pattern and password fields support a confirmation entry:

```js
{
	name: 'Jed Watson',
	email: 'not an email',
	password: 'abcd',
	password_confirm: '1234'
}
```

```js
// 400 validation error
{
	error: 'validation errors',
	detail: {
		email: {
			type: 'invalid',
			error: 'email is invalid'
		},
		password: {
			type: 'invalid',
			error: 'passwords must match'
		}
	}
}
```

Other errors are returned with HTTP `500`. For example, if the provided values cause a lower-level database error (e.g. a unique index on a field) the response will look like this:

```js
{
	'name.full': 'Test User',
	email: 'user@keystonejs.com', // already exists in the database
	password: 'test1234',
	password_confirm: 'test1234'
}
```

```js
// 500 database error
{
	error: 'database error'
	detail: {
		code: 11000
		index: 0
		errmsg: 'E11000 duplicate key error index: keystone-test.users.$email_1 dup key: { "user@keystonejs.com" }',
		op: {
			password: '******',
			email: 'user@keystonejs.com',
			isProtected: false,
			isAdmin: false,
			name: {
				last: 'User',
				first: 'Test',
			},
			_id: '5796184049b4a30ad983b338',
			__v: 0
		}
	}
}
```

Note that the error detail in this case is passed up directly from Mongoose.

## Get an Item

```
GET /api/{list}/{id}
```

Retrieves the data for an item by ID. For example, getting user `57961c4249b4a30ad983b33d` returns the following:

```js
{
	id: '57961c4249b4a30ad983b33d',
	name: 'Jed Watson',
	fields: {
		name: {
			first: 'Jed',
			last: 'Watson'
		}
		email: 'user@keystonejs.com',
		password: '******',
		isAdmin: false
	}
}
```

### Errors

Requesting an ID that doesn't exist will return HTTP `404`:

```js
// 404 not found
{
	err: 'not found',
	id: '1234567890'
}
```

Any other error (e.g. database error) will return HTTP `500`:

```js
// 500 database error
{
	err: 'database error',
	detail: err,
}
```

## Get Items

```
GET /api/{list}
```

Loads items in the list. This endpoint is very flexible and has several features:

* Find all items (default), or query items by a search string and/or field filters
* Sort by any field in the list (defaults based on list options)
* Pagination is supported through the skip and limit options (limit defaults to 100)
* Return the count of all items found and/or an array of items (both are included by default)
* When returning results, you can get data for all fields in the list, a subset of fields, or just the basic `{ id, name }` for each item
* Relationship fields can optional be expanded into `{ id, name }` objects.

### Query Params

* `search` (String) searches for items using the list Search feature
* `filters` (Object or JSON) field filters to apply to the query
* `sort` (String) field to sort by, prepend `-` to reverse the sort order
* `skip` (Number `0`) count of items to skip
* `limit` (Number `100`) maximum number of items to return
* `count` (Boolean `true`) whether to include the count of total items found
* `results` (Boolean `true`) whether to include the results array (contains an object for each item)
* `fields` (String or Boolean `true`) comma-delimited list of fields to include in the results; set to `false` or `""` to exclude all field data, or `true` to include all field data (default). Can also include arbitrary paths stored in the database but not referenced in the List schema.
* `expandRelationshipFields` (Boolean) populates all relationship fields with `{ id, name }` data

### Examples

Search for users named "Jed" and return all data:

```
GET /api/users?search=Jed
```

```js
{
	count: 1,
	results: [
		{
			id: '5f66cede-5266-11e6-beb8-9e71128cae77',
			name: 'Jed Watson',
			fields: {
				name: { first: 'Jed', last: 'Watson' },
				email: 'user@keystonejs.com',
				isAdmin: true,
				company: 'f4782f72-90a2-49db-b43c-2ed8b7b04104'
			}
		}
	]
}
```

Filter for all admins and return the company field, expanding relationships and only returning the first two results sorted by name, skipping the first 3, excluding the count:

```
GET /api/users?count=false&fields=company&expandRelationshipFields=true&filters={isAdmin:true}&limit=2&skip=3&sort=name
```

```js
{
	results: [
		{
			id: '5f66cede-5266-11e6-beb8-9e71128cae77',
			name: 'Jed Watson',
			fields: {
				company: {
					id: 'f4782f72-90a2-49db-b43c-2ed8b7b04104',
					name: 'Thinkmill'
				}
			}
		},
		{
			id: '869408c8-1da7-4f0c-ab6b-2ef7cf611abc',
			name: 'Joss Mackison',
			fields: {
				company: {
					id: 'f4782f72-90a2-49db-b43c-2ed8b7b04104',
					name: 'Thinkmill'
				}
			}
		}
	]
}
```

Count all admins, excluding results:

```
GET /api/users?filters={isAdmin:true}&results=false
```

```js
{
	count: 9,
}
```

Find all companies, with just the basic data set (no fields):

```
GET /api/companies?fields=false
```

```js
{
	count: 1,
	results: [
		{
			id: 'f4782f72-90a2-49db-b43c-2ed8b7b04104',
			name: 'Thinkmill'
		}
	]
}
```

### Errors

A database error executing the query will cause HTTP `500` to be sent, for example:

```js
// 500 database error
{
	error: 'database error',
	detail: err
}
```


## Get List Counts

```
GET /api/counts
```

Retrieves total item counts for all registered lists, by List Key:

```js
{
	'counts': {
		'Company': 1,
		'User': 9
	}
}
```

### Errors

A database error executing the query will cause HTTP `500` to be sent, for example:

```js
// 500 database error
{
	error: 'database error',
	detail: err
}
```


## Delete Item(s)

```
[1] POST /api/{list}/{id}/delete
[2] POST /api/{list}/delete?ids=1,2,3
[3] POST /api/{list}/delete
```

Deletes one or more items in a List. This endpoint supports [1] a single ID parameter in the URL, [2] a comma-delimited list of IDs in the query string, or [3] an array of IDs in the POST Body:

```js
{
	ids: [
		'5f66cede-5266-11e6-beb8-9e71128cae77',
		'869408c8-1da7-4f0c-ab6b-2ef7cf611abc'
	]
}
```

When items are successfully deleted, a count and the deleted IDs will be returned:

```js
{
	success: true,
	count: 2,
	ids: [
		'5f66cede-5266-11e6-beb8-9e71128cae77',
		'869408c8-1da7-4f0c-ab6b-2ef7cf611abc'
	]
}
```

### Errors

You cannot delete the user you are currently logged in as. If you are deleting items in the `user model`, and include the session user's ID, it will return HTTP `403`:

```js
// 403 not allowed
{
	error: 'not allowed',
	detail: 'You can not delete yourself'
}
```

If a List has the `{ nodelete: true }` option set, this endpoint will refuse to delete the items with HTTP `400` and the following error:

```js
// 400 nodelete
{
	error: 'nodelete'
}
```

A database error executing the query will cause HTTP `500` to be sent, for example:

```js
// 500 database error
{
	error: 'database error',
	detail: err
}
```
