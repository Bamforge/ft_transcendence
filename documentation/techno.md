# Techno

Ce fichier a pour but de répertorier et de faire une brève description de toutes les technologies utilisées dans ce projet, qu’il s’agisse de modules, d'extensions, de fichiers ou autres.

## Table des matières

- [Techno](#techno)
	- [Table des matières](#table-des-matières)
	- [Node.js](#nodejs)
		- [npm (Node Package Manager)](#npm-node-package-manager)
		- [Commande npm :](#commande-npm-)
	- [TypeScript (\*.ts)](#typescript-ts)
		- [Avantages de TypeScript :](#avantages-de-typescript-)
	- [SQLite](#sqlite)
		- [Avantages de SQLite :](#avantages-de-sqlite-)
	- [HTML (HyperText Markup Language)](#html-hypertext-markup-language)
		- [Avantages de HTML :](#avantages-de-html-)
	- [CSS (Cascading Style Sheets)](#css-cascading-style-sheets)
		- [Avantages de CSS :](#avantages-de-css-)
	- [JSON (JavaScript Object Notation)](#json-javascript-object-notation)
		- [Avantages de JSON :](#avantages-de-json-)
	- [Docker](#docker)
		- [Avantages de Docker :](#avantages-de-docker-)
		- [Commandes Docker courantes :](#commandes-docker-courantes-)
	- [Docker Compose](#docker-compose)
		- [Avantages de Docker Compose :](#avantages-de-docker-compose-)
		- [Commandes Docker Compose courantes :](#commandes-docker-compose-courantes-)


## Node.js

Node.js est un environnement d'exécution JavaScript côté serveur, construit sur le moteur V8 de Chrome. Il permet d'exécuter des scripts JavaScript côté serveur, offrant une plateforme pour le développement d'applications serveur rapides et évolutives.

### npm (Node Package Manager)

npm est un gestionnaire de paquets pour Node.js. Il permet d’installer, de gérer et de maintenir les dépendances de ton projet. npm permet également d'exécuter des scripts définis dans le fichier `package.json`. Il est essentiel pour installer des modules comme Express, SQLite3, et TypeScript.

**En gros** : npm (Node Package Manager) est un gestionnaire de paquets pour JavaScript. Il te permet d'installer et de gérer les bibliothèques et dépendances nécessaires à ton projet. C'est un peu comme un magasin en ligne pour les outils de développement.

### Commande npm :
- `npm init` : Initialise un projet Node.js.
- `npm install` : Installe les dépendances du projet.
- `npm run <script>` : Exécute des scripts définis dans `package.json`.

---

## TypeScript (*.ts)

TypeScript est un langage de programmation open-source développé par Microsoft qui étend JavaScript en y ajoutant un système de types statiques. Contrairement à JavaScript, qui est dynamiquement typé, TypeScript permet de spécifier des types pour les variables, les fonctions, les objets, etc. Cela signifie que les erreurs de type peuvent être détectées au moment de la compilation, avant même d'exécuter le code.

> **En gros** : TypeScript, c'est comme JavaScript mais avec plus de règles pour éviter les erreurs liées aux types de variables. Contrairement à JavaScript, où une variable peut changer de type à tout moment (par exemple, passer de nombre à texte), TypeScript impose des types fixes pour les variables. Cela permet de détecter les erreurs plus tôt, avant même que le code ne soit exécuté, rendant ton code plus sûr et plus facile à maintenir.

### Avantages de TypeScript :
- Typage statique : Aide à détecter les erreurs de type au moment de la compilation.
- Meilleure lisibilité et maintenabilité du code.
- Large support de la communauté et de nombreux outils de développement.

---

## SQLite

SQLite est un moteur de base de données relationnelle légère et sans serveur. Elle est utilisée principalement pour des applications qui n'ont pas besoin de bases de données volumineuses ou distribuées. SQLite stocke toute la base de données dans un seul fichier, ce qui simplifie son déploiement.

> **En gros** : SQLite est une base de données légère et autonome. Elle est utilisée pour stocker des données sous forme de fichiers locaux, sans avoir besoin d'un serveur de base de données séparé. Elle est idéale pour les applications simples ou les prototypes.

### Avantages de SQLite :
- Base de données légère, intégrée et rapide.
- Aucune installation de serveur nécessaire.
- Idéale pour les applications locales ou les petites applications web.

---

## HTML (HyperText Markup Language)

HTML est un langage de balisage utilisé pour structurer le contenu sur le web. Il définit la structure de la page, avec des éléments comme les titres, paragraphes, images, liens et formulaires.

> **En gros** : HTML est le langage de base qui structure le contenu d'une page web. C'est comme les fondations d'un bâtiment, qui déterminent où vont les textes, les images, et les liens.

### Avantages de HTML :
- Fondement de toutes les pages web.
- Simple à apprendre et à utiliser.
- Large support dans tous les navigateurs web.

---

## CSS (Cascading Style Sheets)

CSS est un langage de style utilisé pour décrire la présentation d'un document HTML. Il permet de gérer l'apparence des éléments HTML en définissant des couleurs, des polices, des espacements, etc.

> **En gros** : CSS est le langage qui stylise une page web. Il permet de définir les couleurs, les tailles, les polices et la disposition des éléments pour que la page soit belle et fonctionnelle.

### Avantages de CSS :
- Sépare le contenu (HTML) de la présentation (CSS).
- Permet de créer des designs réactifs et dynamiques.
- Large écosystème d'outils et de bibliothèques.

---

## JSON (JavaScript Object Notation)

JSON est un format léger de stockage et d'échange de données. Il est facile à lire et à écrire pour les humains et à analyser et générer pour les machines. JSON est souvent utilisé pour transmettre des données entre un serveur et un client dans des applications web modernes.

> **En gros** : JSON est un format léger pour échanger des données entre un serveur et un client (par exemple, entre un navigateur et un serveur). Il est facile à lire et à écrire pour les humains, et facile à analyser et à générer pour les ordinateurs.

### Avantages de JSON :
- Facile à utiliser avec JavaScript.
- Format très populaire pour les APIs web.
- Légère et facilement analysable.

## Docker

Docker est une plateforme qui permet de créer, déployer et exécuter des applications dans des conteneurs. Un conteneur est un environnement isolé qui contient tout ce qu'il faut pour exécuter une application, ce qui garantit que l'application fonctionnera de manière identique quel que soit l'environnement.

> **En gros** : Docker permet de créer des environnements isolés, appelés conteneurs, pour exécuter des applications. Cela garantit que ton application fonctionne de la même manière, peu importe où elle est déployée (sur ton PC, un serveur, etc.).

### Avantages de Docker :
- **Isolation** : Chaque application fonctionne dans son propre environnement sans interférer avec les autres.
- **Portabilité** : Les conteneurs peuvent être exécutés sur n'importe quelle machine compatible Docker.
- **Facilité de déploiement** : Une fois qu'une application est conteneurisée, elle peut être facilement déployée sur n'importe quel serveur.
  
### Commandes Docker courantes :
- `docker build .` : Crée une image à partir du `Dockerfile`.
- `docker run <image>` : Lance un conteneur à partir d'une image.
- `docker ps` : Affiche les conteneurs en cours d'exécution.
  

## Docker Compose

Docker Compose est un outil qui permet de définir et de gérer des applications multi-conteneurs. Avec Docker Compose, tu peux utiliser un fichier de configuration YAML (`docker-compose.yml`) pour définir les services de ton application (comme une base de données, un serveur web, etc.), et lancer tous les conteneurs nécessaires avec une seule commande.

> **En gros** : Docker Compose est un outil qui te permet de définir et de gérer plusieurs conteneurs Docker avec un seul fichier. Cela simplifie la gestion des applications complexes qui nécessitent plusieurs services (comme une base de données et un serveur web) tournant ensemble.

### Avantages de Docker Compose :
- **Simplicité** : Configure plusieurs conteneurs avec un seul fichier.
- **Facilité de gestion** : Permet de gérer des applications complexes avec de nombreux services.
- **Développement local** : Permet de simuler facilement des environnements de production locaux pour le développement.

### Commandes Docker Compose courantes :
- `docker-compose up` : Démarre les conteneurs définis dans `docker-compose.yml`.
- `docker-compose down` : Arrête et supprime les conteneurs.
- `docker-compose build` : Reconstruit les images des conteneurs.
