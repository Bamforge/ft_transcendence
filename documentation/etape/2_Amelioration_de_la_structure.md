# Amelioration de la strucutre

- [Amelioration de la strucutre](#amelioration-de-la-strucutre)
	- [Objectif de ce fichier](#objectif-de-ce-fichier)
	- [Problémathique](#problémathique)
	- [Comment faire](#comment-faire)
- [Résumé de l'idée :](#résumé-de-lidée-)
- [Exemple de détail de fichiers :](#exemple-de-détail-de-fichiers-)
	- [docker/Node\_js/Dockerfile](#dockernode_jsdockerfile)
	- [docker-compose.yml](#docker-composeyml)

## Objectif de ce fichier

L'objectif de ce fichier est de montrer comment améliorer la structure du projet en utilisant Docker.

## Problémathique

La problématique réside dans le fait que, pour tester des services comme Node.js, nous devons souvent installer plusieurs outils et dépendances, ce qui peut être lourd et fastidieux. Cependant, grâce à la containerisation avec Docker, il est possible de créer et de gérer ces services sans avoir besoin de les installer directement sur la machine. Ce fichier expliquera comment Docker peut simplifier cette gestion et comment cela impacte la structure du projet.

> Modifier le makefile aussi

## Comment faire

```
.
├── Game/                 # Ton application (TypeScript, HTML, etc.)
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── autres fichiers...
├── docker/               # Toute ta config Docker
│   └── Node_js/          # Pour builder ton app Node.js (Dockerfile ici)
│       ├── Dockerfile
│       └── config_json   # Cont les fichier json de configuration
└── docker-compose.yml    # À la racine pour tout piloter
```

---

# Résumé de l'idée :

- `Game/` → ton **vrai code applicatif** (rien de docker ici).
- `docker/` → **tous les Dockerfile** et fichiers associés aux services (NodeJS, DB, etc).
- `docker-compose.yml` → **orchestration générale** : relier `Game` et `docker/Node_js/`.

---

# Exemple de détail de fichiers :

## docker/Node_js/Dockerfile

```Dockerfile
FROM node:20

WORKDIR /app

COPY ./docker/Node_js/config_json/ ./

COPY ../../Game/. ./

EXPOSE 3000
```


---

## docker-compose.yml

```yaml
services:
  game:
    image: game_project
    build:
      context: .
      dockerfile: docker/Node_js/Dockerfile
    ports:
      - "3000:3000"
    command:  sh -c "npm install && npm run build && npm start"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      retries: 3
      start_period: 10s
      timeout: 10s
```

Nous verons l'utilité des fichiers json