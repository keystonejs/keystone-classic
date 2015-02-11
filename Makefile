REPORTER = progress
ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSXHINT_CMD = node_modules/jsxhint/cli.js
JSCS_CMD = node_modules/.bin/jscs
JSCS_REPORTER = console
JSCS_FILES = `find . -path "*.js" ! -path "./node_modules/*" \
		! -path "./public/js/lib/*" \
		! -path "./docs/*" \
		! -path "./coverage/*"`
MOCHA_CMD = node_modules/mocha/bin/_mocha
JSHINT_REPORTER = node_modules/jshint-stylish/stylish.js
TESTS = test/*.js

default: test

test:
	$(MOCHA_CMD)

jshint:
	@echo "\nRunning JSHint ..."
	@$(JSXHINT_CMD) --reporter $(JSHINT_REPORTER) .; true

jscs:
	@echo "\nRunning JSCS ..."
	@$(JSCS_CMD) $(JSCS_FILES) --reporter=$(JSCS_REPORTER); true

test-cov: clean
	@$(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter $(REPORTER)

test-travis: test-spec
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

test-spec:
	node $(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter spec

clean:
	rm -rf coverage

.PHONY: default lint test test-cov test-spec test-travis clean
