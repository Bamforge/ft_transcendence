# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: yzaoui <yzaoui@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/04/27 05:34:16 by yzaoui            #+#    #+#              #
#    Updated: 2025/04/27 06:17:20 by yzaoui           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Commandes par défaut
.PHONY: all help run

# Variables
# Couleurs
GREEN = \033[1;32m
BLUE = \033[1;34m
YELLOW = \033[1;33m
RED = \033[1;31m
NC = \033[0m  # Sans couleur

PORT = 3000
PROJECT_NAME = transandance
GAME_DIR = ./Game

# Commande principale : affiche l'aide
all: help

$(PROJECT_NAME): install build start

test : $(PROJECT_NAME)

# Aide
help:
	@echo "$(YELLOW)📝 Utilisation :$(NC)"
	@echo "\t$(GREEN)make$(NC) \t\t   : Affiche les commande disponible de make."
	@echo "\t$(GREEN)make install$(NC) \t   : Installe les dépendances du projet."
	@echo "\t$(GREEN)make build$(NC) \t   : Compile le projet."
	@echo "\t$(GREEN)make start$(NC) \t   : Démarre le serveur."
	@echo "\t$(GREEN)make stop$(NC) \t   : Arrête le serveur et nettoie."
	@echo "\t$(GREEN)make test$(NC) \t   : $(BLUE)Fait sa pour testé$(NC)"

# Commande pour installer les dépendances
install:
	@echo "$(YELLOW)🔄 Installation des dépendances...$(NC)"
	npm install --prefix $(GAME_DIR)

# Commande pour compiler le projet
build:
	@echo "$(YELLOW)🔨 Compilation du projet...$(NC)"
	npm run build --prefix $(GAME_DIR)

# Commande pour démarrer le serveur
start:
	@echo "$(YELLOW)🚀 Démarrage du serveur...$(NC)"
	npm run start --prefix $(GAME_DIR)

# Commande pour arrêter le serveur et nettoyer
stop:
	@echo "$(YELLOW)⏹️ Arrêt du serveur et nettoyage...$(NC)"
	@PID=$$(lsof -t -i:$(PORT)); \
	if [ -n "$$PID" ]; then \
		kill $$PID; \
		echo "$(GREEN)Serveur arrêté$(NC)"; \
	else \
		echo "$(RED)Aucun serveur en cours$(NC)"; \
	fi

fclean : stop