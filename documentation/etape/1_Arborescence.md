# Arborescence

- [Arborescence](#arborescence)
	- [Objectif de ce fichier](#objectif-de-ce-fichier)
	- [Prérequis](#prérequis)
	- [Comment faire](#comment-faire)
	- [Explication](#explication)
		- [L'arborescence du dossier Game](#larborescence-du-dossier-game)
		- [Détail des fichiers et dossiers](#détail-des-fichiers-et-dossiers)
			- [`db/`](#db)
			- [`dist/`](#dist)
			- [`node_modules/`](#node_modules)
			- [`package.json`](#packagejson)
			- [`package-lock.json`](#package-lockjson)
			- [`public/`](#public)
			- [`src/`](#src)
			- [`tsconfig.client.json`](#tsconfigclientjson)
			- [`tsconfig.server.json`](#tsconfigserverjson)
	- [Comment tester l'arborescence](#comment-tester-larborescence)


## Objectif de ce fichier

Décrire la structure du dossier Game/ et fournir des explications détaillées sur chaque partie pour faciliter la compréhension du projet Pong. Ce fichier vise également à résoudre la problématique suivante :
"Mettre en place une structure minimale permettant de créer un site pour tester le jeu Pong avec son design et la base de données, sans implémenter de backend ni de sécurité."

> Si des technologies ne sont pas maitrisé vous pouvez consultez ce fichier md [Techno](./../techno.md)

## Prérequis

Avant de pouvoir utiliser et tester correctement le projet, vous devez avoir :

- **Visual Studio Code** installé sur votre machine.
- L'extension **Live Share** installée sur Visual Studio Code (pour partager ou tester en collaboration).
- **Node.js** installé sur votre système.

## Comment faire

1. **Initialiser le projet**  
   - Installer les dépendances 
   Si tu as déjà un fichier package.json configuré, il te suffit d'installer les dépendances définies dedans :
     ```bash
     npm install
     ```

1. **Structurer le projet**  
   Organise les dossiers :  
   - `src/` pour les fichiers TypeScript  
   - `public/` pour les fichiers HTML, CSS, JS  
   - `db/` pour la base de données SQLite

2. **Créer le serveur**  
   editer un fichier `server.ts` qui servira a init le serveur.

3. **Base de données**  
   Crée la base SQLite (`data.sqlite`) editer pour crée la bdd.

4. **Développer le jeu**  
   Dans `game.ts`, écris la logique de base du jeu Pong (mouvement de la balle, collisions).

5. **Frontend**  
   Crée une page HTML (`index.html`) et lie `game.ts` pour afficher le jeu.

6. **Tester**  
   Lance le serveur :  
   ```bash
   node dist/server.js
   ```
   Accède au jeu sur `http://localhost:3000`.

## Explication

Nous allons d'abord examiner l'arborescence du dossier Game puis expliquer chaque partie des sous-dossiers.

### L'arborescence du dossier Game

```
.
├── db
│   └── data.sqlite
├── dist
│   └── server.js
├── node_modules
│   └── [PLEIN DE TRUC]
├── package-lock.json
├── package.json
├── public
│   ├── game.js
│   └── index.html
├── src
│   ├── public
│   │   └── game.ts
│   └── server.ts
├── tsconfig.client.json
└── tsconfig.server.json
```

### Détail des fichiers et dossiers

#### `db/`
- Contient la base de données `data.sqlite`.
- Utilisée pour stocker les données du jeu (exemples : scores, utilisateurs, parties).

#### `dist/`
- Dossier généré automatiquement après compilation du serveur.
- Le fichier `server.js` est le serveur en JavaScript, prêt à être lancé avec Node.js.

#### `node_modules/`
- Contient toutes les dépendances installées via npm (`npm install`).
- **Ne pas modifier** manuellement ce dossier.

#### `package.json`
- Fichier de configuration du projet.
- Il contient :
  - Les scripts utiles (`start`, `build`, etc.).
  - Les dépendances nécessaires pour faire tourner le projet.
  - Les informations sur le projet (nom, version, etc.).

#### `package-lock.json`
- Permet de verrouiller précisément les versions des dépendances.
- Généré automatiquement par npm.

#### `public/`
- Dossier contenant les fichiers statiques visibles par l'utilisateur.
- `index.html` : page principale du jeu Pong.
- `game.js` : script JavaScript pour la logique du jeu (fichier généré à partir du TypeScript).

#### `src/`
- Contient le code source en TypeScript.
- `public/game.ts` : logique du jeu écrite en TypeScript (avant compilation vers `public/game.js`).
- `server.ts` : script du serveur, permettant de faire tourner le backend du projet.

#### `tsconfig.client.json`
- Configuration TypeScript dédiée au code client (`game.ts`).
- Permet de définir comment compiler le TypeScript en JavaScript pour la partie visible du navigateur.

#### `tsconfig.server.json`
- Configuration TypeScript dédiée au serveur (`server.ts`).
- Permet de définir comment compiler le serveur pour Node.js.

---

## Comment tester l'arborescence

1. Allez dans  `Game/`.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez la compilation du projet (si nécessaire) :
   ```bash
   npm run build
   ```
4. Démarrez le serveur :
   ```bash
   node dist/server.js
   ```
5. Ouvrez votre navigateur et accédez à l'adresse affichée (généralement `http://localhost:3000`).
6. Vous devriez voir le jeu Pong s'afficher.

