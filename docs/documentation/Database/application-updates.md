# Application Updates

Keystone includes an updates framework, which you can enable by setting the `auto update` option to `true`.

Updates provide an easy way to seed your database, transition data when your models change, or run transformation scripts against your database.

Update files should be named using a semantic version followed by an optional key, like `0.0.1-init.js`. The version numbers are used to order the update scripts correctly, while the keys are a nice way to identify what each update does.

Each update file should export a single function, which should accept a single argument - the `next(err)` callback, to be called when the update is complete.

All the update files will be executed (each one waits for the previous update to complete) before the web server is started.

If the `next` callback receives an error it will be reported to the console, and application initialisation will halt.

You can temporarily disable updates from running in development by setting a `__defer__` property on the exported function to `true`. Any subsequent updates will be skipped, but the application will be started.

Updates are only run once, and each completed update is logged in an `app_updates` collection in your database.

**Update Script Example**
Creates a new admin User

```javascript
var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(done) {
  new User.model({
    name: { first: 'Admin', last: 'User' },
    password: 'admin',
    isAdmin: true
  }).save(done);
};
```

#### A Note on Required Relationships

The application updates framework saves all of the items it receives before it connects up their relationships. This means if your item has a required relationship, the initial save will fail.

Please consider opting out of the `exports.create` mechanism to instead have more control of the direct operations that happen with Mongo, for example:

```
const keystone = require('keystone');
const PostCategory = keystone.list('PostCategory');
const Post = keystone.list('Post');

const importData = [
	{ name: 'A draft post', category: 'Keystone JS' },
	...
];

exports = function (done) {
	const importPromise = importData.map(({ name, category }) => createPost({ name, category }));

	importPromise.then(() => done()).catch(done);
};

const categories = {};

const createPost = ({ name, category }) => {
	let postCategory = new PostCategory.model({ category });
	if (categories[category]) {
		postCategory = categories[category];
	}
	categories[category] = postCategory;
	const post = new Post.model({ name });
	post.category = postCategory._id.toString();
	return Promise.all([
		post.save(),
		postCategory.save()
	]);
}
```

Fixing this properly would require significant refactoring of how the update framework works, which we're unable to commit to for the moment. [The relevant GitHub Issue is here](https://github.com/keystonejs/keystone/issues/2980), and of course PRs are always welcome.
