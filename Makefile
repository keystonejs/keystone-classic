ISTANBUL_CMD = node_modules/istanbul/lib/cli.js cover
JSHINT_CMD = node_modules/jshint/bin/jshint
MOCHA_CMD = node_modules/mocha/bin/_mocha

export NODE_ENV = test

.PHONY: default lint test test-cov test-spec test-travis clean

# make executes the first task in the makefile when run without arguments
default: test

lint:
	$(JSHINT_CMD) --reporter node_modules/jshint-stylish/stylish.js .; true

test: lint
	$(MOCHA_CMD)

test-cov: clean
	node $(ISTANBUL_CMD) $(MOCHA_CMD) --

test-spec:
	node $(ISTANBUL_CMD) $(MOCHA_CMD) -- --reporter spec

test-travis: test-spec
	if test -n "$$CODECLIMATE_REPO_TOKEN"; then codeclimate < coverage/lcov.info; fi

clean:
	rm -rf coverage
