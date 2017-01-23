import createStaticRouter from '../createStaticRouter';
import express from 'express';
import request from 'supertest';
import path from 'path';
import demand from 'must';

describe('createStaticRouter', () => {
	let keystone = {
		get (confKey) {
			switch (confKey) {
				case 'admin path':
					return 'keystone';
			}
		},
		getPath () {
			return '';
		},
		fieldTypes: { boolean: 'Boolean' },
	};

	it('given no config, it should serve `FieldTypes` bundle normally', done => {
		const router = createStaticRouter(keystone);
		const app = express();
		app.use(router);
		request(app)
			.get('/js/fields.js')
			.expect('Content-Type', 'application/javascript')
			.end((err, res) => {
				demand(err).be.null();
				done();
			});
	});

	it('given correct field middleware config, it should serve `FieldTypes` bundle normally', done => {
		const custoKeystone = Object.assign({}, keystone, {
			middlewareFieldTypes: next => sections => {
				sections.Fields.custofield = path.join(__dirname, './custofield/custofieldField.js');
				return next(sections);
			},
		});
		const router = createStaticRouter(custoKeystone);
		const app = express();
		app.use(router);
		request(app)
			.get('/js/fields.js')
			.expect('Content-Type', 'application/javascript')
			.end((err, res) => {
				demand(err).be.null();
				done();
			});
	});

	it('given middleware config, given custom field lookup path, it should serve `FieldTypes` bundle normally', done => {
		const custoKeystone = Object.assign({}, keystone, {
			middlewareFieldTypes: next => sections => {
				sections.Fields.custofield = 'custofield/custofieldField.js';
				return next(sections);
			},
			fieldsLookupPaths: [__dirname],
		});
		const router = createStaticRouter(custoKeystone);
		const app = express();
		app.use(router);
		request(app)
			.get('/js/fields.js')
			.expect('Content-Type', 'application/javascript')
			.end((err, res) => {
				demand(err).be.null();
				done();
			});
	});
});
