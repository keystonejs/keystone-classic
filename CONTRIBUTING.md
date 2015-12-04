# Contributing

Thanks for your interest in KeystoneJS. It's a project we're excited to be
working on, and we welcome all forms of contribution - from issue reports,
to PRs and documentation / write-ups.

As a simple guide:

* Ensure that your effort is aligned with the project's roadmap by talking to
the maintainers, especially if you are going to spend a lot of time on it.
* Make sure there's an Issue open for any work you take on and intend to submit
as a pull request - it helps core members review your concept and direction
early and is a good way to discuss what you're planning to do.
* If you open an issue and are interested in working on a fix, please let us
know. We'll help you get started, rather than adding it to the queue.
* If the pull request fixes a bug, it should include tests that fail without the changes, and pass with them.
* Make sure you do not add regressions by running `npm test`. Please also
[follow our established coding conventions](https://github.com/keystonejs/keystone/wiki/Coding-Standards)
(with regards to formatting, etc)
* You can also run `npm run lint`
but please ensure there are not more violations than before your changes.
* All new features and changes need documentation. They live over at the  [Keystone-site](https://github.com/keystonejs/keystonejs-site) repo.
* We have three translations so far,
please read our [Documentation Translation  Guidelines](https://github.com/keystonejs/keystone/wiki/Documentation-Translation-Guidelines).


If you are working on the React Admin UI, you'll also need to know this:

* The Admin UI is generated with Browserify when Keystone starts. To enable
watching files, set the environment variable `KEYSTONE_DEV`, e.g

```
KEYSTONE_DEV=true node keystone.js
```

If you'd like to talk to the core developers, we all hang out in a Slack
channel to discuss Keystone. Ping @jedwatson to get an invite.
