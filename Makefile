# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: yzaoui <yzaoui@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/04/27 05:34:16 by yzaoui            #+#    #+#              #
#    Updated: 2025/04/28 04:12:50 by yzaoui           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Commandes par défaut
.PHONY: all help build up clean check re

# Couleurs
GREEN = \033[1;32m
BLUE = \033[1;34m
YELLOW = \033[1;33m
RED = \033[1;31m
NC = \033[0m  # Sans couleur

# Variables

PORT = 3000
PROJECT_NAME = transandance
GAME_DIR = ./Projet/Game
DOCKER_COMPOSE := docker-compose
COMPOSE_FILE := ./Projet/docker-compose.yml
DC := $(DOCKER_COMPOSE) -f $(COMPOSE_FILE)

# Commande principale : affiche l'aide
all: help

$(PROJECT_NAME): build up
	@echo "$(GREEN)✔ Application construite et démarrée avec succès !$(NC)"

test : $(PROJECT_NAME)


# Commande pour installer les dépendances
install:
	@echo "$(YELLOW)🔄 Installation des dépendances...$(NC)"
	npm install --prefix $(GAME_DIR)

# Commande pour compiler le projet
build:
	@echo "$(BLUE)🔧 Construction des images Docker...$(NC)"
	@$(DC) build
	@echo "$(GREEN)✔ Images Docker construites avec succès !$(NC)"

# Démarrer les conteneurs
up:
	@echo "$(BLUE)🚀 Démarrage des conteneurs Docker...$(NC)"
	@$(DC) up -d
	@echo "$(GREEN)✔ Conteneurs Docker démarrés avec succès !$(NC)"


# Nettoyer les conteneurs, volumes et réseaux
stop:
	@echo "$(RED)🛑 Stop les conteneurs ...$(NC)"
	@$(DC) down
	@echo "$(GREEN)✔ Arret terminé !$(NC)"

fclean : stop

# Nettoyer les conteneurs, volumes et réseaux
clean:
	@echo "$(RED)🧹 Nettoyage des conteneurs et volumes Docker...$(NC)"
	@$(DC) down -v --remove-orphans --rmi all
	@sudo rm -rf $(MARIADB_DIR) $(WORDPRESS_DIR)
	@echo "$(GREEN)✔ Nettoyage terminé !$(NC)"

re: clean build up

# Aide
help:
	@echo "Faire \"docker exec -it projet-game-1 sh\" pour rentré dans le docker"
	@echo "$(YELLOW)📝 Utilisation :$(NC)"
	@echo "  $(GREEN)make$(NC)              : Fais help"
	@echo "  $(GREEN)make build$(NC)        : Construire uniquement les images Docker"
	@echo "  $(GREEN)make up$(NC)           : Démarrer uniquement les conteneurs Docker"
	@echo "  $(GREEN)make stop$(NC)         : Arret uniquement les conteneurs Docker"
	@echo "  $(GREEN)make clean$(NC)        : Nettoyer les conteneurs et volumes Docker"
	@echo "  $(GREEN)make re$(NC)           : Nettoyer et reconstruire les images Docker et les redémarre"
	@echo "  $(GREEN)make help$(NC)         : Afficher cette aide"
	@echo "  $(GREEN)make test$(NC)         : $(BLUE)Fait sa pour testé$(NC)"
