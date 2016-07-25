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

## Session

Manages creating, destroying and validating KeystoneJS sessions (specifically, logged in users)

### Get

```
GET /api/session
```

Returns the currently logged in user, or `undefined`.

#### Response

```js
{
	user: req.user
}
```

### Sign In

```
POST /api/session/signin
```

Signs in with the provided credentials. Returns the matched user, or error information.

Must include CSRF token in headers.

#### POST Data

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

#### Response

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

### Sign In

```
POST /api/session/signout
```

Signs the current user out (if any). Takes no data.

#### Response

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


## Lists

Manages creating, listing, updating and deleting items in a List.

### Get Items

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

#### Query Params

* `search` (String) searches for items using the list Search feature
* `filters` (Object or JSON) field filters to apply to the query
* `sort` (String) field to sort by, prepend `-` to reverse the sort order
* `skip` (Number `0`) count of items to skip
* `limit` (Number `100`) maximum number of items to return
* `count` (Boolean `true`) whether to include the count of total items found
* `results` (Boolean `true`) whether to include the results array (contains an object for each item)
* `fields` (String or Boolean `true`) comma-delimited list of fields to include in the results; set to `false` or `""` to exclude all field data, or `true` to include all field data (default). Can also include arbitrary paths stored in the database but not referenced in the List schema.
* `expandRelationshipFields` (Boolean) populates all relationship fields with `{ id, name }` data

#### Examples

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
GET /api/users?count=false&fields=email&filters={isAdmin:true}&limit=2&skip=3&sort=name
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

#### Errors

A database error executing the query will cause HTTP `500` to be sent, for example:

```js
// 500 database error
{
	error: 'database error',
	detail: err
}
```

## Items

Single-item implementations of List APIs for get, update and delete.
