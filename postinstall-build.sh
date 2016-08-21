#!/bin/sh
# Build the UI bundle if missing after install
# install the dev dependencies if needed
set -e
canary=admin/public/js/common.js
devFile=node_modules/.bin/webpack
if [ ! -d admin ]; then
	echo "Run me from the git repo root" >&2
	exit 1
fi
if [ ! -e $canary ] || \
[ `find admin/ -newer $canary | wc -l` -ne 0 ]; then
	shouldRemoveDev=
	# we assume that if webpack is not installed, we don't have the dev deps
	if [ ! -e $devFile ]; then
		shouldRemoveDev=true
		npm install --only=dev
	fi
	npm run build
	if [ -n "$shouldRemoveDev" ]; then
		npm prune --production
	fi
fi
