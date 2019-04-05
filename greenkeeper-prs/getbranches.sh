#! /bin/bash
for BRANCH in $(git branch --all | grep remotes/origin/greenkeeper)
do
	BRANCH_NAME=$(echo $BRANCH | sed "s/remotes\/origin\///g")
	echo $BRANCH_NAME
done
echo "%DONE%"
