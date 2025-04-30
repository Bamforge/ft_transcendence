# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: yzaoui <yzaoui@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/04/27 05:34:16 by yzaoui            #+#    #+#              #
#    Updated: 2025/04/30 23:36:02 by yzaoui           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Default targets
.PHONY: all help local install build_local clean fclean exec test_local docker build_img up_cont stop_dock clean_dock test_dock show_img show_container go_in_container re test

# Colors
GREEN  = \033[1;32m
BLUE   = \033[1;34m
YELLOW = \033[1;33m
RED    = \033[1;31m
NC     = \033[0m # No Color

# Variables
PORT             = 3000
PROJECT_NAME     = transandance
GAME_DIR         = ./Projet/Game
JS_EXEC_PATH     = $(GAME_DIR)/dist
NODE_MODULE_PATH = $(GAME_DIR)/node_modules
DOCKER_COMPOSE   := docker-compose
COMPOSE_FILE     := ./Projet/docker-compose.yml
DC               := $(DOCKER_COMPOSE) -f $(COMPOSE_FILE)
IMG_NAME         = game_project_img
CONTAINER_NAME   = game_project_cont

# Default action
all: help

### Local Development

local: build_local exec

# Install Node.js dependencies
install:
	@echo "$(YELLOW)🔄 Installing Node.js dependencies...$(NC)"
	@npm install --prefix "$(GAME_DIR)"
	@echo "$(GREEN)✔ Node.js dependencies installed successfully!$(NC)"

# Build the local project
build_local: install
	@echo "$(YELLOW)🛠️ Building local project...$(NC)"
	@npm --prefix "$(GAME_DIR)" run build
	@echo "$(GREEN)✔ Local build completed!$(NC)"

# Clean build files
clean:
	@echo "$(YELLOW)🧹 Cleaning build files...$(NC)"
	@npm --prefix "$(GAME_DIR)" run clean
	@echo "$(RED)🗑️ Build files cleaned!$(NC)"

# Force clean: remove node_modules and package-lock.json
fclean: clean
	@echo "$(YELLOW)🧹 Force cleaning project...$(NC)"
	@rm -rf "$(NODE_MODULE_PATH)" "$(GAME_DIR)/package-lock.json"
	@echo "$(RED)🗑️ Project cleaned (node_modules and lock file removed)!$(NC)"

# Execute the built code locally
exec: build_local
	@echo "$(YELLOW)🚀 Executing local application...$(NC)"
	@npm --prefix "$(GAME_DIR)" start
	@echo "$(GREEN)✔ Application started locally!$(NC)"

# Test the local setup
test_local: install build_local exec

### Docker Management

docker: build_img up_cont

# Build Docker image
build_img:
	@echo "$(YELLOW)🐳 Building Docker image...$(NC)"
	@$(DC) build --no-cache
	@echo "$(GREEN)✔ Docker image "$(IMG_NAME)" built successfully!$(NC)"

# Start Docker containers
up_cont:
	@echo "$(YELLOW)🚀 Starting Docker containers...$(NC)"
	@$(DC) up -d --remove-orphans --no-deps
	@echo "$(GREEN)✔ Docker containers started successfully!$(NC)"

# Stop Docker containers
stop_dock:
	@echo "$(YELLOW)🛑 Stopping Docker containers...$(NC)"
	@$(DC) down
	@echo "$(GREEN)✔ Docker containers stopped!$(NC)"

# Clean Docker containers, volumes, and networks
clean_dock: stop_dock
	@echo "$(YELLOW)🧹 Cleaning Docker resources...$(NC)"
	@$(DC) down -v --rmi all
	@echo "$(RED)🗑️ Docker resources cleaned!$(NC)"

# Show existing Docker images
show_img:
	@echo "$(YELLOW)🖼️ Showing existing Docker images...$(NC)"
	@docker images
	@echo "$(GREEN)✔ Docker images listed!$(NC)"

# Show running Docker containers
show_container:
	@echo "$(YELLOW)🐳 Showing running Docker containers...$(NC)"
	@docker ps
	@echo "$(GREEN)✔ Running Docker containers listed!$(NC)"

# Enter the running Docker container
go_in_container:
	@echo "$(YELLOW)🚪 Entering Docker container "$(CONTAINER_NAME)"...$(NC)"
	@docker exec -it "$(CONTAINER_NAME)" /bin/sh
	@echo "$(GREEN)✔ You are now inside the container! Type 'exit' to return.$(NC)"

### Combined Actions

# Rebuild and restart Docker containers
re: clean_dock build_img up_cont
	@echo "$(BLUE)🔄 Rebuilding and restarting Docker environment...$(NC)"
	@echo "$(GREEN)✔ Docker environment rebuilt and restarted!$(NC)"


# Help message
help:
	@echo "$(BLUE)✨ Makefile Help for $(PROJECT_NAME) ✨$(NC)"
	@echo " "
	@echo "$(YELLOW)🎯 Local Development:$(NC)"
	@echo " $(BLUE)make local$(NC)     : Builds and runs the application locally."
	@echo " $(GREEN)make install$(NC)   : Installs Node.js dependencies."
	@echo " $(GREEN)make build_local$(NC) : Builds the local project."
	@echo " $(GREEN)make clean$(NC)     : Cleans build files."
	@echo " $(GREEN)make fclean$(NC)    : Force cleans (removes node_modules and lock file)."
	@echo " $(BLUE)make exec$(NC)      : Executes the built local application."
	@echo " $(GREEN)make test_local$(NC): Runs local tests."
	@echo " "
	@echo "$(YELLOW)🐳 Docker Management:$(NC)"
	@echo " $(BLUE)make docker$(NC)    : Builds and starts Docker containers."
	@echo " $(GREEN)make build_img$(NC) : Builds the Docker image."
	@echo " $(BLUE)make up_cont$(NC)  : Starts Docker containers."
	@echo " $(GREEN)make stop_dock$(NC) : Stops Docker containers."
	@echo " $(GREEN)make clean_dock$(NC): Cleans Docker containers, volumes, and networks."
	@echo " $(GREEN)make show_img$(NC)  : Shows existing Docker images."
	@echo " $(GREEN)make show_container$(NC): Shows running Docker containers."
	@echo " $(GREEN)make go_in_container$(NC): Enters the running Docker container."
	@echo " "
	@echo "$(YELLOW)🔄 Combined Actions:$(NC)"
	@echo " $(GREEN)make re$(NC)        : Rebuilds and restarts the Docker environment."
	@echo " "
	@echo "$(YELLOW)ℹ️ Additional Notes:$(NC)"
	@echo " - Ensure Docker is installed and running if you intend to use Docker targets."
	@echo " - The '$(CONTAINER_NAME)' variable is used to interact with your container."
	@echo " - You can customize variables like PORT, PROJECT_NAME, etc., at the top of this file."
	@echo " "
