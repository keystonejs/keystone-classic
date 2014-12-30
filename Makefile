ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSHINT_CMD = node_modules/jshint/bin/jshint
MOCHA_CMD = node_modules/mocha/bin/_mocha

export NODE_ENV = test

.PHONY: lint test test-cov test-spec test-travis

lint:
	$(JSHINT_CMD) --reporter node_modules/jshint-stylish/stylish.js .; true

test:
	make lint
	$(MOCHA_CMD)

test-cov:
	rm -rf coverage
	node $(ISTANBUL_CMD) $(MOCHA_CMD) --

test-spec:
	node $(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter spec

test-travis:
	make test-spec
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi
