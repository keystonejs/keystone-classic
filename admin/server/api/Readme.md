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

## Items

Single-item implementations of List APIs for get, update and delete.
