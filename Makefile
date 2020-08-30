SHELL = /usr/bin/env bash
NAMESPACE = stabback
PROJECT = interceptor
IMAGE_NAME = $(NAMESPACE)/$(PROJECT)
COMPOSE_FILE = docker/docker-compose.yml
COMPOSE_FILE_DEV = docker/docker-compose.development.yml

ifndef GIT_COMMIT
	GIT_COMMIT = $(shell git rev-parse HEAD)
endif

ifndef BRANCH_NAME
	BRANCH_NAME = $(shell git rev-parse --abbrev-ref HEAD)
endif

ifndef TAG
	TAG = $(subst /,-,$(BRANCH_NAME))
endif

ifndef STACK_NAME
	STACK_NAME = $(NAMESPACE)-$(PROJECT)-$(TAG)
endif

export NAMESPACE
export PROJECT
export IMAGE_NAME
export GIT_COMMIT
export BRANCH_NAME
export TAG
export STACK_NAME
export COMPOSE_FILE
export COMPOSE_FILE_DEV
export STACK_DEV

.PHONY: *

help: ## Display helpful descriptions for all make tasks
	@echo ""
	@echo "Makefile tasks:"
	@echo "------------------------------------------"
	@grep '^[a-z_-]*:.*##' Makefile | sed 's/^\([a-z_-]*\):.*## \(.*\)/\1=\2/' | column -ts= -c2
	@echo "------------------------------------------"

dev:
	@echo "Starting Mongo and Mongo Express in the background"
	@docker-compose -f "$$COMPOSE_FILE" -f "$$COMPOSE_FILE_DEV" up -d mongo mongo-express
	@echo "Starting up the project in dev mode"
	@yarn && yarn dev

start:
	@echo "Starting production deployment"
	docker-compose -f "$$COMPOSE_FILE" up -d

stop:
	@echo "Stopping production and dev services"
	@docker-compose -f "$$COMPOSE_FILE" -f "$$COMPOSE_FILE_DEV" down

docker-clean: ## Clean up all temporary docker containers
	@echo Removing "$$IMAGE_NAME":"$$TAG"
	@set +e
	@docker rmi "$$IMAGE_NAME":"$$TAG"

docker-image: ## Build all docker images
	@echo Building and tagging as "$$IMAGE_NAME":"$$TAG"
	@docker build -f ./docker/Dockerfile -t "$$IMAGE_NAME":"$$TAG" .

docker-tag: ## Tag docker images for ECR
	docker tag "$$IMAGE_NAME":"$$TAG" "$$IMAGE_NAME":"$$GIT_COMMIT"
	docker tag "$$IMAGE_NAME":"$$TAG" "$$IMAGE_NAME":"$$TAG"
	@echo ---
	@echo Tagged: "$$IMAGE_NAME":"$$GIT_COMMIT"
	@echo Tagged: "$$IMAGE_NAME":"$$TAG"

	@echo Building and tagging as "$$IMAGE_NAME":"$$TAG"
docker-push: ## Push docker images to repository
	docker push "$$IMAGE_NAME":"$$GIT_COMMIT"
	docker push "$$IMAGE_NAME":"$$TAG"
	@echo ---
	@echo Pushed: "$$IMAGE_NAME":"$$GIT_COMMIT"
	@echo Pushed: "$$IMAGE_NAME":"$$TAG"

docker-audit: ## Run yarn audit in docker, create json report, fail if production packages are vulnerable
	@echo "Auditing "$$IMAGE_NAME":"$$TAG""
	@echo "-----"
	@docker run "$$IMAGE_NAME":"$$TAG" yarn audit

# docker-test: ## Run yarn tests in docker . - Removed - tests do not run on docker alpine.  TODO - address
#	@echo "Testing "$$IMAGE_NAME":"$$TAG""
#	@echo "-----"
#	@docker run "$$IMAGE_NAME":"$$TAG" yarn test
