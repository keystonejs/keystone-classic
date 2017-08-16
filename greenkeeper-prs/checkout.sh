#! /bin/bash
BRANCHES=`cat /dev/stdin`
echo $BRANCHES
for BRANCH in $BRANCHES
do
	echo "Checking out $BRANCH"
	git checkout -b local-$BRANCH origin/$BRANCH
	git merge master
	git commit -am 'merge in master'
	git push origin local-$BRANCH:$BRANCH
	exit 1
done
