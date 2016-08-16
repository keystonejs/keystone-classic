# Email Field

`String` — Displayed as a text field in the Admin UI.

> Note: Input must look like a valid email address (can be blank unless field is required)

```js
  { type: Types.Email, displayGravatar: true }
```

## Options

### `displayGravatar` `Boolean`
whether to display a gravatar image in the Admin UI

## Underscore methods

### `gravatarUrl(input, size, defaultImage, rating)`
generates a gravatar image request url

```js
  item.email = "demo@keystonejs.com";
  item._.email.gravatarUrl(); // "//www.gravatar.com/avatar/74a0071e5f3a7107b570b7d4a1a7619d?s=80&d=identicon&r=g"
  item._.email.gravatarUrl(200,'mm','r'); // "//www.gravatar.com/avatar/74a0071e5f3a7107b570b7d4a1a7619d?s=200&d=mm&r=r"
```
