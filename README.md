# ft_transcendence

Créer un site web de Pong en temps réel avec Docker, sécurité et gameplay basique.

## Table des matières

- [ft\_transcendence](#ft_transcendence)
	- [Table des matières](#table-des-matières)
	- [Branchement](#branchement)
	- [Arborescence du projet](#arborescence-du-projet)
	- [Technologies utilisées](#technologies-utilisées)
	- [Choix technologiques](#choix-technologiques)
	- [Installation et démarrage](#installation-et-démarrage)
	- [Utilisation](#utilisation)
	- [A faire :](#a-faire-)
	- [Membres](#membres)

## Branchement

Nous **sommes** actuellement dans la branche "**Game\_without\_backend**". Elle a pour objectif de **réaliser** le projet sans le backend et la sécurité.

Juste l'aspect **esthétique** et la **base de données**.

## Arborescence du projet

Voici l'arborescence actuelle des fichiers et dossiers :

```
.
├── Projet/
├── LICENSE
├── README.md
├── Makefile
└── documentation/
```

À la racine du repos, nous trouvons deux fichiers :

- ``LICENSE`` : Ce fichier définit les conditions légales d'utilisation de notre projet selon [la BSD 3-Clause License](https://fr.wikipedia.org/wiki/Licence_BSD).
- ``README.md`` : C'est le fichier que vous êtes en train de lire actuellement. Il sert de vitrine pour présenter notre **projet**.
- ``Makefile`` : Qui permettra automatiquement de tester ce qu'on fait.

Nous disposons également des répertoires suivants :

- ``Projet/`` : Il s'agit actuellement du répertoire où nous **réalisons** le projet.
- ``documentation/`` : Un dossier contenant plusieurs fichiers Markdown qui ont pour but de nous aider dans notre documentation, **recherche**, et organisation.

## Technologies utilisées

Vous pouvez consulter : [Techno](./documentation/techno.md) qui énumère toutes les technologies utilisées avec un résumé simplifié et une description.

## Choix technologiques

### Backend : Fastify vs PHP

Nous avons choisi Fastify comme framework backend pour les raisons suivantes :
- Performance supérieure : Fastify est l'un des frameworks Node.js les plus rapides
- Support natif de WebSocket pour le jeu en temps réel
- Architecture moderne et extensible
- Meilleure intégration avec TypeScript
- Écosystème riche pour la gestion des WebSockets et des événements en temps réel

## Installation et démarrage

### Prérequis
- Docker et Docker Compose
- Node.js (v18 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/ft_transcendence.git
cd ft_transcendence
```

2. Installer les dépendances du frontend :
```bash
cd Projet/Game/frontend
npm install
```

3. Construire le frontend :
```bash
npm run build
```

4. Démarrer les services avec Docker :
```bash
docker-compose up --build
```

Le serveur sera accessible à l'adresse : http://localhost:3000

## Utilisation

Faites `make` et suivez les instructions du Makefile à la racine du répertoire.

## A faire :

Yassine : Rediger [ce fichier](./documentation/etape/2_Amelioration_de_la_structure.md)


N'importe de qui :Metre en place docker.

## Membres

- [Coltcivers](https://github.com/Coltcivers)
- [Transc42](https://github.com/Transc42)
- [mozaBit](https://github.com/mozaBit)
- [yatsuZ](https://github.com/yatsuZ)
