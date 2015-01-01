REPORTER = progress
ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSHINT_CMD = node_modules/jshint/bin/jshint
MOCHA_CMD = node_modules/mocha/bin/_mocha
TESTS = test/*.js

default: test

test: lint
	@NODE_ENV=test $(MOCHA_CMD) \
		--require should \
		--growl \
		--reporter $(REPORTER)

lint:
	@$(JSHINT_CMD) --reporter node_modules/jshint-stylish/stylish.js .; true

test-cov: clean
	@$(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter $(REPORTER)

test-travis: test-spec
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

clean:
	rm -rf coverage

.PHONY: default lint test test-cov test-spec test-travis clean
