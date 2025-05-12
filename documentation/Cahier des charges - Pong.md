# 1. Introduction

## 1.1 But

Ce document spécifie les exigences pour le site web du Pong Contest, une plateforme de jeu Pong multijoueur en temps réel. Il sert de référence pour les développeurs, les testeurs et les parties prenantes afin d'assurer une compréhension claire et partagée des capacités et des contraintes du système.

## 1.2 Portée

Le système fournit une application web monopage pour des parties et des tournois Pong multijoueurs locaux et à distance. Il inclut l'inscription des utilisateurs, la mise en relation, le jeu en temps réel, la gestion des tournois et des mesures de sécurité.

## 1.3 Définitions, acronymes et abréviations

- **SPA** : Application monopage (Single-Page Application)
- **API** : Interface de programmation d'application (Application Programming Interface)
- **WS/WSS** : WebSocket / WebSocket Sécurisé
- **DB** : Base de données (Database)
- **JWT** : JSON Web Token
- **HTTPS** : Protocole de transfert hypertexte sécurisé (HyperText Transfer Protocol Secure)

## 1.4 Références

- Mozilla Firefox dernière version stable (à partir d'avril 2025)
- Node.js + Fastify
- SQLite 3
- Docker

# 2. Description générale

## 2.1 Perspective du produit

L'application est une SPA indépendante, éventuellement soutenue par un serveur Node.js/Fastify et une base de données SQLite3, déployée via Docker pour la portabilité.

## 2.2 Fonctions du produit

- Inscription des utilisateurs (alias) et authentification (modules optionnels pour la gestion complète des utilisateurs et l'authentification à deux facteurs)
- Création de tournois, planification et affichage des tableaux
- Jeu Pong en temps réel via le clavier ; prend en charge le jeu local en écran partagé et les joueurs à distance via WSS
- Annonces de mise en relation et progression
- Tableau des scores et statistiques des joueurs

## 2.3 Classes d'utilisateurs et caractéristiques

- **Invité** : Peut rejoindre les tournois en entrant un alias
- **Utilisateur enregistré** : (Optionnel) Possède un compte persistant, connexion sécurisée
- **Administrateur** : Gère les modules, surveille les parties

## 2.4 Environnement d'exploitation

- **Frontend** : Navigateur moderne (dernière version de Firefox ; compatible avec Chrome, Edge)
- **Backend (si utilisé)** : Node.js 18+, framework Fastify
- **Base de données** : Fichier SQLite3
- **Déploiement** : Conteneur Docker

## 2.5 Contraintes de conception et d'implémentation

- La SPA doit prendre en charge la navigation arrière/avant du navigateur
- Pas d'erreurs ou d'avertissements non gérés dans la console
- Tous les secrets dans `.env`, ignorés par git
- HTTPS/WSS obligatoire

## 2.6 Hypothèses et dépendances

- La taille des tournois est suffisamment petite pour les performances de SQLite3
- Les utilisateurs disposent d'un navigateur moderne avec support WebSocket

# 3. Fonctionnalités et exigences du système

## 3.1 Exigences fonctionnelles

### Inscription des utilisateurs et alias

- **FR1.1** : Demander un alias au début du tournoi ; réinitialiser pour un nouveau tournoi.

### Mise en relation et tournoi

- **FR2.1** : Apparier automatiquement les participants ; afficher le prochain match et l'ordre du tableau.

### Jeu

- **FR3.1** : Pong en temps réel avec une vitesse de raquette identique (joueurs et IA).
- **FR3.2** : Jeu local en écran partagé ; **FR3.3** : Jeu à distance via WSS.

### Sécurité

- **FR4.1** : Hacher tous les mots de passe stockés.
- **FR4.2** : Valider toutes les entrées ; se protéger contre les injections SQL et XSS.
- **FR4.3** : Sécuriser les routes API ou les formulaires SPA via HTTPS.

## 3.2 Exigences d'interface externe

- **Interface utilisateur** : Canvas réactif pour Pong ; contrôles de navigation SPA
- **Interface logicielle** : WebSocket (wss://) pour les données en temps réel
- **Interface de base de données** : Accès au fichier SQLite3

## 3.3 Exigences non fonctionnelles

- **Utilisabilité** : Contrôles intuitifs ; flux de tournoi clair
- **Maintenabilité** : Configurable via des modules (Frontend, Graphiques, Sécurité JWT)
- **Portabilité** : Dockerisé, lancement en une seule commande
- **Performance** : Latence ≤100 ms pour les mises à jour des mouvements de raquette
- **Fiabilité** : 99,5 % de disponibilité dans le conteneur
