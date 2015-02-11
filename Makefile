ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSXHINT_CMD = node_modules/jsxhint/cli.js
JSCS_CMD = node_modules/.bin/jscs
JSCS_REPORTER = console
MOCHA_CMD = node_modules/mocha/bin/_mocha
JSHINT_REPORTER = node_modules/jshint-stylish/stylish.js

default: test

test:
	$(MOCHA_CMD)

lint:
	@echo "Running JSHint ..."
	@$(JSXHINT_CMD) --reporter $(JSHINT_REPORTER) .

style:
	@echo "\nRunning JSCS ..."
	@$(JSCS_CMD) .

test-cov: clean
	@$(ISTANBUL_CMD) $(MOCHA_CMD) --

test-travis: test-cov
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

clean:
	rm -rf coverage

.PHONY: default lint test test-cov test-travis clean
