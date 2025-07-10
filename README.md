# Gestionnaire de Tâches

## Description du projet

Ce projet est une application fullstack pour la gestion de tâches :  
- Frontend : Application React pour créer, modifier, supprimer et afficher des tâches.  
- Backend : API NestJS pour gérer les tâches, connectée à une base de données MySQL (MySQL Workbench) via Prisma.  

L’application permet de manipuler les tâches avec un CRUD complet et une interface utilisateur simple et intuitive.


## Installation et mise en place

### Prérequis
- Node.js 22.15.0 & npm 10.9.5

### Frontend
1. Cloner le dépôt frontend dans votre dossier local: `git clone https://github.com/dabofonsa/gestion-taches-front.git`
2. Se déplacer dans le dossier gestion-taches-front: `cd gestion-taches-front`
3. Installer les dépendances avec: `npm install`
4. Démarrer l’application React : `npm start`
5. Ouvrir l'application dans son navigateur: `localhost:3001 ou localhost:port_de_votre_choix`

## Choix techniques
### Frontend
- React 19.1.0 : avec hooks pour gérer l’état et les effets (useState, useEffect).
- Fetch: pour interagir avec le backend via les endpoints REST.
- react-toastify: pour afficher des notifications utilisateur (succès, erreurs).
- Lucide-react: pour une bibliothèque d’icônes moderne et légère.
- Gestion de l’édition en ligne, ajout de tâches, suppression via appels API.

## Fonctionnalités réalisées:
- Récupération, affichage et filtrage des tâches.
- Création, édition et suppression des tâches côté frontend.
- Notifications pour confirmer les actions utilisateurs.
- Filtrage de tâches en fonction du niveau de priorité

## Bonus réalisé
- Ajout d’un système de tri par date de création et un filtre par priorité des tâches.
