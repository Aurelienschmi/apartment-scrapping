# Projet Scraping et Next.js

## Description
Une application web qui scrappe des données de LeBonCoin, les stocke dans Supabase et les affiche via une interface Next.js.

## Structure du projet
- `scraper/` : Scripts Python pour le scraping.
- `web/` : Frontend et backend (API routes) en Next.js.

## Installation
### Scraper
```bash
cd scraper
pip install -r requirements.txt
```

### Web
```bash
cd web
npm install
npm run dev
```

## Fonctionnalités
- Scraping automatique chaque heure.
- Stockage dans Supabase.
- Affichage des données avec recherche et filtres.