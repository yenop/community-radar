# Community Radar

Surveillance automatique de communautés en ligne avec détection intelligente de posts pertinents.

## Fonctionnalités
- Surveillance de sources Reddit (extensible à Facebook, Discord, forums)
- Critères de détection en langage naturel via IA
- Notifications Telegram en temps réel
- Dashboard Angular pour gérer sources et critères

## Stack
- **Frontend** : Angular 17+ (standalone components)
- **Backend** : Python FastAPI
- **Base de données** : MariaDB
- **Déploiement** : Docker + Docker Compose
- **URL** : https://communityradar.nextly.ovh

## Lancement rapide
```bash
cp backend/.env.example backend/.env
docker compose up -d
```
