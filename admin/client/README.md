# Client

This is the client you see when you go to `/keystone`. It's a React.js app that uses Redux for state management.

## Overview

The client consists of two separate bundles: `Signin` and `App`.

`Signin` is, as the name suggests, the signin page. This is a separate bundle because we inject certain data into the `App` that a signed-out user should not be able to access.

`App` consists of three parts: The Homepage (Dashboard with lists), the List view and the single Item view.

Both of these have a separate EJS template that is rendered in the backend, [`admin/server/templates/signin.html`](../server/templates/signin.html) and [`admin/server/templates/index.html`](../server/templates/index.html). This where the data for the `App` bundle is injected too.

## Folder structure

We use a variant of the hirarchic folder structure detailled by @ryanflorence in [this gist](https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346). Each part of our application can have a `components` folder with some reusable components that _only that part uses_ and a `shared` folder that _this part and some components further down the hirarchy use_.

```
client
├── App/
│   ├── components/                  # Common, reusable components that only App uses
│   ├── screens/                     # Client side routes
│   │   ├── Home
│   │   ├── Item
│   │   └── List
│   ├── shared/                      # Common, reusable components that further down screens use too
│   └── store.js                     # The Redux store, also contains URL parameter logic for now
├── Signin
│   └── components/
├── utils/                           # Some common utilities we use in both Signin and App
├── README.md
├── constants.js                     # A few shared constants
└── packages.js                      # A list of our vendor dependencies for browserify to bundle separately
```

This means an import like `import SomeSharedComponent from '../../../shared/SomeSharedComponent'` is perfectly fine, but if you find yourself import from a `component` folder like so `import SomeComponent from '../../../component/SomeComponent'` move that component to the `shared/` folder on the same level.

Every top-level part (e.g. `Home`) of our application can also be `connect`ed to the redux store and have associated `actions`, `constants` and `reducers`.

We co-locate test files in `test/` folders right next to the files we're testing.
