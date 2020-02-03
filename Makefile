upstream:
	@git remote add upstream https://github.com/iamogbz/node-js-boilerplate
	@git push origin master
	@git push --all
	@echo "upstream: remote successfully configured"

eject:
	@git fetch --all --prune
	@git checkout -b boilerplate-ejection
	@git pull upstream master --allow-unrelated-histories --no-edit -Xours
	@git pull upstream boilerplate-ejection --no-edit -Xours
	@git reset master --soft && git add --all && git commit -m "chore: eject"
	@echo "eject: branch created, complete by replacing placeholder values"

typescript:
	@git fetch --all --prune
	@git checkout -b typescript-conversion
	@git pull upstream master --allow-unrelated-histories --no-edit -Xours
	@git pull upstream typescript-conversion --no-edit -Xours
	@git reset master --soft && git add --all && git commit -m "chore: typescript"
	@echo "typescript: branch created, merge to master to complete coversion"

build:
	rm -r ./built
	npm run build-types
	npm run build

ifndef VERBOSE
.SILENT:
endif
