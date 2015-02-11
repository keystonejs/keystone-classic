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

default: test

test:
	$(MOCHA_CMD)

lint:
	@echo "\nRunning JSHint ..."
	@$(JSXHINT_CMD) --reporter $(JSHINT_REPORTER) .

	@echo "\nRunning JSCS ..."
	@$(JSCS_CMD) $(JSCS_FILES) --reporter=$(JSCS_REPORTER)

test-cov: clean
	@$(ISTANBUL_CMD) $(MOCHA_CMD) --

test-travis: test-cov
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

clean:
	rm -rf coverage

.PHONY: default lint test test-cov test-travis clean
