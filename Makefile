clean:
	-rm -r node_modules vendor

install:
	npm install
	git submodule update --init

run:
	node server
