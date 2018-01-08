var keystone = require('../../');

const historyModelSuffix = '_revisions';

function getHistoryModelName (list) {
	return list.options.schema.collection + historyModelSuffix;
}

function getHistoryModel (list, userModel) {

	const collection = getHistoryModelName(list);

	const schema = new keystone.mongoose.Schema({
		id: { type: keystone.mongoose.Schema.Types.ObjectId, ref: collection },
		time: { type: Date, index: true, required: true },
		operation: { type: String, index: true, required: true },
		changes: { type: [String], index: true },
		data: { type: keystone.mongoose.Schema.Types.Mixed, required: true },
	}, {
		id: true,
		versionKey: false,
	});

	if (userModel) {
		schema.add({
			user: { type: keystone.mongoose.Schema.Types.ObjectId, ref: userModel },
		});
	}

	return keystone.mongoose.model(collection, schema, collection);

}

/**
 * List history option
 *
 * When enabled, it tracks changes to each document on save or remove.
 */

module.exports = function history () {

	const list = this;

	// If model already exists for a '_revisions' in an inherited model, log a warning but skip creating the new model (inherited _revisions model will be used).
	const collectionName = getHistoryModelName(list);
	if (list.get('inherits')
		&& collectionName.indexOf(historyModelSuffix, collectionName.length - historyModelSuffix.length) !== -1
		&& keystone.mongoose.models[collectionName]) {
		console.log('List/model already exists for ' + collectionName + '.\nWon\'t re-create, keystone continuing.');
		return;
	}

	const userModel = keystone.get('user model');

	const HistoryModel = list.HistoryModel = getHistoryModel(this, userModel);

	list.schema.add({
		__rev: Number,
	});


	list.schema.pre('save', function (next) {
		if (this.isModified()) {
			this.__rev = (typeof this.__rev === 'number') ? this.__rev + 1 : 1;

			const data = this.toObject();
			delete data._id;
			delete data.__v;
			delete data.__rev;

			const doc = {
				id: this.id,
				time: Date.now(),
				operation: this.isNew ? 'create' : 'update',
				changes: [],
				data: data,
			};

			for (const path in list.fields) {
				if (this.isModified(path)) {
					doc.changes.push(path);
				}
			}

			if (list.autokey) {
				if (this.isModified(list.autokey.path)) {
					doc.changes.push(list.autokey.path);
				}
			}

			if (userModel && this._req_user) {
				doc.user = this._req_user;
			}

			new HistoryModel(doc).save(next);
		}
		next();
	});

	list.schema.pre('remove', function (next) {
		const data = this.toObject();
		data.__v = undefined;

		const doc = {
			time: Date.now(),
			operation: 'delete',
			data: data,
		};

		if (userModel && this._req_user) {
			doc.user = this._req_user;
		}

		new HistoryModel(doc).save(next);
	});

};
