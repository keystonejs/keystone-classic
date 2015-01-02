REPORTER = progress
ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSXHINT_CMD = node_modules/jsxhint/cli.js
MOCHA_CMD = node_modules/mocha/bin/_mocha
JSHINT_REPORTER = node_modules/jshint-stylish/stylish.js
TESTS = test/*.js

default: test

test: lint
	@NODE_ENV=test $(MOCHA_CMD) \
		--require should \
		--growl \
		--reporter $(REPORTER)

lint:
	@$(JSXHINT_CMD) --reporter $(JSHINT_REPORTER) .; true

test-cov: clean
	@$(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter $(REPORTER)

test-travis: test-spec
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

# TODO explore generating documentation from a makefile task
# TODO explore using jscoverage over istanbul for coverage reports

clean:
	rm -rf coverage

.PHONY: default lint test test-cov test-spec test-travis clean
