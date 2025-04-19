ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

UID=${shell id -u}
GID=${shell id -g}

.PHONY: pwa_pages
pwa_pages:
	yarn workspace @5quared/idee-app build:pages

.PHONY: pwa_dev
pwa_dev:
	yarn workspace @5quared/idee-app serve:dev


