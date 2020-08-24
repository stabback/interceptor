SHELL = /usr/bin/env bash
NAMESPACE = stabback
PROJECT = interceptor
IMAGE_NAME = $(NAMESPACE)/$(PROJECT)

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

ifndef STACK_FILE
	STACK_FILE = stack.yml
endif

export NAMESPACE
export PROJECT
export IMAGE_NAME
export GIT_COMMIT
export BRANCH_NAME
export TAG
export STACK_NAME
export STACK_FILE
export BUILD_NUMBER

.PHONY: *

help: ## Display helpful descriptions for all make tasks
	@echo ""
	@echo "Makefile tasks:"
	@echo "------------------------------------------"
	@grep '^[a-z_-]*:.*##' Makefile | sed 's/^\([a-z_-]*\):.*## \(.*\)/\1=\2/' | column -ts= -c2
	@echo "------------------------------------------"

clean: ## Clean up compiled files and testing data
	for i in build dist node_modules .tmp; do \
		rm -rf "$$i"; \
	done

docker-clean: ## Clean up all temporary docker containers
	set +e
	docker rmi "$$IMAGE_NAME":"$$TAG"

docker-image: ## Build all docker images
	@echo Building and tagging as "$$IMAGE_NAME":"$$TAG"
	@docker build -t "$$IMAGE_NAME":"$$TAG" .

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

docker-test: ## Run yarn tests in docker
	@echo "Testing "$$IMAGE_NAME":"$$TAG""
	@echo "-----"
	@docker run "$$IMAGE_NAME":"$$TAG" yarn test

stack-deploy: ## Deploy docker stack
	docker stack deploy -c "$$STACK_FILE" "$$STACK_NAME"

stack-teardown: ## Teardown docker stack
	docker stack rm "$$STACK_NAME"