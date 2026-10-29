# ─────────────────────────────────────────────────────────────────────────────
# CraftCV Makefile
# The CI pipeline (Jenkinsfile) calls: install, lint, test, build
# Docker targets: docker-build, docker-up, docker-push
# Kubernetes targets: k8s-apply, k8s-status, k8s-delete
# ─────────────────────────────────────────────────────────────────────────────

IMAGE_NAME ?= craftcv-frontend
IMAGE_TAG  ?= latest
REGISTRY   ?= docker.io/$(DOCKER_USER)

.PHONY: install install-server lint test test-server build run \
        docker-build docker-up docker-push \
        k8s-apply k8s-status k8s-delete

# ── Local development ─────────────────────────────────────────────────────────

install:
	cd Frontend && npm ci --include=dev

install-server:
	cd server && npm ci

lint:
	cd Frontend && npm run lint

# Runs server test suite when server dependencies are installed
test:
	@if [ -d "server/node_modules" ]; then cd server && npm test; else echo "Run 'make install-server' to install server test dependencies."; fi

test-server:
	cd server && npm test

build:
	cd Frontend && npm run build

run:
	cd Frontend && npm run dev

# ── Docker ───────────────────────────────────────────────────────────────────

docker-build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker-up:
	docker compose up --build

docker-push:
	@test -n "$(DOCKER_USER)" || (echo "Set DOCKER_USER=<your-hub-username>"; exit 1)
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)

# ── Kubernetes ───────────────────────────────────────────────────────────────

k8s-apply:
	kubectl apply -f k8s/deployment.yml
	kubectl apply -f k8s/service.yml

k8s-status:
	kubectl get deployments,pods,services -l app=craftcv

k8s-delete:
	kubectl delete -f k8s/
