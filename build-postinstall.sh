#!/bin/sh
# Build the UI bundle if missing after install
# install the dev dependencies if needed
set -e
canary=admin/public/js/common.js
devFile=node_modules/.bin/webpack
if [ ! -d admin/public ]; then
	echo "Run me from the git repo root" >&2
	exit 1
fi
if [ ! -e $canary ]; then
	echo "=== Building admin UI code ==="
	shouldRemoveDev=
	# we assume that if webpack is not installed, we don't have the dev deps
	if [ ! -e $devFile ]; then
		shouldRemoveDev=true
		# carefully curated collection of build dependencies, update with package.json
		npm install \
			aphrodite \
			babel-core \
			babel-loader \
			babel-plugin-transform-object-assign \
			babel-polyfill \
			babel-preset-es2015 \
			babel-preset-react \
			babel-preset-stage-2 \
			codemirror \
			css-loader \
			json-loader \
			raw-loader \
			react-alt-text \
			react-color \
			react-day-picker \
			react-dnd \
			react-dnd-html5-backend \
			react-domify \
			react-images \
			react-markdown \
			react-proxy-loader \
			react-redux \
			react-router \
			react-router-redux \
			react-tinymce-input \
			redux \
			redux-saga \
			redux-thunk \
			scriptjs \
			style-loader \
			webpack
	fi
	npm run build
	# Not removing the dev deps - they might be needed next build time
	# if [ -n "$shouldRemoveDev" ]; then
	# 	npm prune --production
	# fi
	echo >&2
	echo "=== To avoid this build in the future, use 'npm run git-build' ===" >&2
	echo "=== and npm install the resulting branch instead ===" >&2
	echo >&2
fi
